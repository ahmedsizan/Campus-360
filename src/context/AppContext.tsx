import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, FALLBACK_BUSES, FALLBACK_COMPLAINTS, FALLBACK_FOOD_ITEMS, FALLBACK_LOST_FOUND, FALLBACK_NOTICES, FALLBACK_SEAT_BOOKINGS } from '../lib/supabaseClient';
import { 
  Bus, 
  BusSeatBooking,
  BusStatus, 
  CartItem, 
  Complaint, 
  ComplaintStatus, 
  FoodItem, 
  LostFoundItem, 
  NavigationTab, 
  Notice, 
  Order, 
  ToastNotification 
} from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Active Tab
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Notices (Supabase)
  notices: Notice[];
  loadingNotices: boolean;
  addNotice: (notice: Omit<Notice, 'id' | 'created_at'>) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  refetchNotices: () => Promise<void>;

  // Transport / Buses (Supabase)
  buses: Bus[];
  loadingBuses: boolean;
  updateBusStatus: (busId: string, status: BusStatus, location: string, eta: string) => Promise<boolean>;
  refetchBuses: () => Promise<void>;

  // Bus Seat Reservation
  seatBookings: BusSeatBooking[];
  loadingSeatBookings: boolean;
  bookSeat: (booking: Omit<BusSeatBooking, 'id' | 'created_at'>) => Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }>;
  cancelSeatBooking: (id: string) => Promise<boolean>;
  refetchSeatBookings: () => Promise<void>;


  // Cafeteria & Cart (Supabase)
  foodItems: FoodItem[];
  loadingFood: boolean;
  cart: CartItem[];
  addToCart: (item: FoodItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkoutCart: () => Promise<boolean>;
  orders: Order[];
  refetchOrders: () => Promise<void>;

  // Lost & Found (Supabase)
  lostFoundItems: LostFoundItem[];
  loadingLostFound: boolean;
  reportLostFound: (item: Omit<LostFoundItem, 'id' | 'created_at'>) => Promise<boolean>;
  refetchLostFound: () => Promise<void>;

  // Complaints (Supabase)
  complaints: Complaint[];
  loadingComplaints: boolean;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'created_at' | 'admin_feedback'>) => Promise<boolean>;
  submitAdminFeedback: (complaintId: string, feedback: string, newStatus: ComplaintStatus) => Promise<boolean>;
  refetchComplaints: () => Promise<void>;

  // Toasts
  toasts: ToastNotification[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  removeToast: (id: string) => void;

  // Profile Modal
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // PWA & App Install
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  triggerInstallApp: () => void;
  isAppInstalled: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('gub_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    localStorage.setItem('gub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // PWA App Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    }
    return false;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ==========================================
  // 1. Notices (Supabase Integration)
  // ==========================================
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notices query notice:', error.message);
        setNotices(FALLBACK_NOTICES);
      } else if (data && data.length > 0) {
        setNotices(data as Notice[]);
      } else {
        setNotices(FALLBACK_NOTICES);
      }
    } catch {
      setNotices(FALLBACK_NOTICES);
    } finally {
      setLoadingNotices(false);
    }
  };

  const addNotice = async (newNotice: Omit<Notice, 'id' | 'created_at'>): Promise<boolean> => {
    const id = `n-${Date.now()}`;
    const noticeObj: Notice = {
      ...newNotice,
      id,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setNotices(prev => [noticeObj, ...prev]);

    try {
      const { error } = await supabase.from('notices').insert([noticeObj]);
      if (error) {
        console.error('Supabase error inserting notice:', error);
        addToast('error', error.message, 'Database Error');
        return false;
      }
      addToast('success', 'Notice published to Supabase database successfully.', 'Notice Broadcasted');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to post notice', 'Error');
      return false;
    }
  };

  const deleteNotice = async (id: string): Promise<boolean> => {
    setNotices(prev => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notices').delete().eq('id', id);
      addToast('info', 'Notice removed.', 'Deleted');
      return true;
    } catch {
      return false;
    }
  };

  // ==========================================
  // 2. Buses / Transport (Supabase Integration)
  // ==========================================
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(true);

  const fetchBuses = async () => {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Supabase fetch buses notice:', error.message);
        setBuses(FALLBACK_BUSES);
      } else if (data && data.length > 0) {
        setBuses(data as Bus[]);
      } else {
        setBuses(FALLBACK_BUSES);
      }
    } catch {
      setBuses(FALLBACK_BUSES);
    } finally {
      setLoadingBuses(false);
    }
  };

  const updateBusStatus = async (
    busId: string, 
    status: BusStatus, 
    location: string, 
    eta: string
  ): Promise<boolean> => {
    // Optimistic UI update
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, status, current_location: location, eta } : b));
    
    try {
      const { error } = await supabase
        .from('buses')
        .update({ status, current_location: location, eta })
        .eq('id', busId);

      if (error) {
        console.error('Supabase error updating bus:', error);
        addToast('error', error.message, 'Database Error');
        return false;
      }
      addToast('success', 'Bus live GPS telemetry updated in Supabase.', 'Fleet Updated');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to update bus', 'Error');
      return false;
    }
  };

  // ==========================================
  // 2.5 Bus Seat Bookings (Supabase + LocalStorage)
  // ==========================================
  const [seatBookings, setSeatBookings] = useState<BusSeatBooking[]>(() => {
    try {
      const saved = localStorage.getItem('gub_bus_seat_bookings');
      return saved ? JSON.parse(saved) : FALLBACK_SEAT_BOOKINGS;
    } catch {
      return FALLBACK_SEAT_BOOKINGS;
    }
  });
  const [loadingSeatBookings, setLoadingSeatBookings] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('gub_bus_seat_bookings', JSON.stringify(seatBookings));
    } catch (e) {
      console.warn('Failed to persist seat bookings to localStorage', e);
    }
  }, [seatBookings]);

  const fetchSeatBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bus_seat_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch seat bookings note:', error.message);
        // keep current/localStorage state
      } else if (data && data.length > 0) {
        setSeatBookings(data as BusSeatBooking[]);
      }
    } catch {
      // keep fallback
    } finally {
      setLoadingSeatBookings(false);
    }
  };

  const bookSeat = async (
    bookingData: Omit<BusSeatBooking, 'id' | 'created_at'>
  ): Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }> => {
    // Check if seat is already occupied for this specific bus, trip slot, and direction on the same booking date
    const isOccupied = seatBookings.some(
      b =>
        b.bus_id === bookingData.bus_id &&
        b.trip_slot === bookingData.trip_slot &&
        b.direction === bookingData.direction &&
        b.seat_number === bookingData.seat_number &&
        b.booking_date === bookingData.booking_date
    );

    if (isOccupied) {
      addToast('error', `Seat #${bookingData.seat_number} has already been reserved by another student!`, 'Seat Unavailable');
      return { success: false, message: 'Seat already reserved' };
    }

    const bookingId = `bk-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const fullBooking: BusSeatBooking = {
      ...bookingData,
      id: bookingId,
      created_at: new Date().toISOString()
    };

    // Optimistically update state and localStorage
    setSeatBookings(prev => [fullBooking, ...prev]);

    try {
      const { error } = await supabase.from('bus_seat_bookings').insert([fullBooking]);
      if (error) {
        console.warn('Supabase bus_seat_bookings insert fallback to local:', error.message);
      }
      addToast(
        'success',
        `Seat #${fullBooking.seat_number} reserved successfully on ${fullBooking.bus_name} (${fullBooking.stoppage_time})!`,
        'Bus Seat Reserved'
      );
      return { success: true, booking: fullBooking };
    } catch {
      addToast(
        'success',
        `Seat #${fullBooking.seat_number} reserved on ${fullBooking.bus_name} (${fullBooking.stoppage_time})!`,
        'Bus Seat Reserved'
      );
      return { success: true, booking: fullBooking };
    }
  };

  const cancelSeatBooking = async (id: string): Promise<boolean> => {
    setSeatBookings(prev => prev.filter(b => b.id !== id));
    try {
      await supabase.from('bus_seat_bookings').delete().eq('id', id);
      addToast('info', 'Bus seat reservation cancelled.', 'Reservation Cancelled');
      return true;
    } catch {
      addToast('info', 'Bus seat reservation cancelled.', 'Reservation Cancelled');
      return true;
    }
  };

  // ==========================================
  // 3. Food Items, Cart & Orders (Supabase Integration)
  // ==========================================
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loadingFood, setLoadingFood] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gub_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    localStorage.setItem('gub_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Supabase fetch food items notice:', error.message);
        setFoodItems(FALLBACK_FOOD_ITEMS);
      } else if (data && data.length > 0) {
        setFoodItems(data as FoodItem[]);
      } else {
        setFoodItems(FALLBACK_FOOD_ITEMS);
      }
    } catch {
      setFoodItems(FALLBACK_FOOD_ITEMS);
    } finally {
      setLoadingFood(false);
    }
  };

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (profile?.role !== 'admin' && profile?.email) {
        query = query.eq('ordered_by', profile.email);
      }
      const { data, error } = await query;
      if (data && !error) {
        setOrders(data as Order[]);
      }
    } catch {
      // ignore
    }
  };

  const addToCart = (item: FoodItem, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.item.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { item, quantity }];
    });
    addToast('success', `Added ${quantity}x ${item.name} to cafeteria tray.`, 'Tray Updated');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.item.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const checkoutCart = async (): Promise<boolean> => {
    if (cart.length === 0) return false;

    const orderId = `GUB-CAF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_id: orderId,
      items: cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity
      })),
      total_price: cartTotal,
      status: 'pending',
      ordered_by: profile?.email || 'student@green.edu.bd',
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);

    try {
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) {
        console.error('Supabase error inserting order:', error);
        addToast('warning', `Order #${orderId} saved locally. (${error.message})`, 'Order Created');
      } else {
        addToast('success', `Order #${orderId} synced with backend database! Ready for pickup.`, 'Order Placed');
      }
      return true;
    } catch {
      addToast('success', `Order #${orderId} confirmed!`, 'Order Confirmed');
      return true;
    }
  };

  // ==========================================
  // 4. Lost & Found (Supabase Integration)
  // ==========================================
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [loadingLostFound, setLoadingLostFound] = useState(true);

  const fetchLostFound = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch lost_found notice:', error.message);
        setLostFoundItems(FALLBACK_LOST_FOUND);
      } else if (data && data.length > 0) {
        setLostFoundItems(data as LostFoundItem[]);
      } else {
        setLostFoundItems(FALLBACK_LOST_FOUND);
      }
    } catch {
      setLostFoundItems(FALLBACK_LOST_FOUND);
    } finally {
      setLoadingLostFound(false);
    }
  };

  const reportLostFound = async (item: Omit<LostFoundItem, 'id' | 'created_at'>): Promise<boolean> => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setLostFoundItems(prev => [newItem, ...prev]);

    try {
      const { error } = await supabase.from('lost_found_items').insert([newItem]);
      if (error) {
        console.error('Supabase error reporting lost/found:', error);
        addToast('error', error.message, 'Database Error');
        return false;
      }
      addToast('success', `"${item.title}" report stored in Supabase backend.`, 'Report Submitted');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to submit report', 'Error');
      return false;
    }
  };

  // ==========================================
  // 5. Complaints & Grievances (Supabase Integration)
  // ==========================================
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch complaints notice:', error.message);
        setComplaints(FALLBACK_COMPLAINTS);
      } else if (data && data.length > 0) {
        setComplaints(data as Complaint[]);
      } else {
        setComplaints(FALLBACK_COMPLAINTS);
      }
    } catch {
      setComplaints(FALLBACK_COMPLAINTS);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const submitComplaint = async (
    newComplaint: Omit<Complaint, 'id' | 'created_at' | 'admin_feedback'>
  ): Promise<boolean> => {
    const compObj: Complaint = {
      ...newComplaint,
      id: `c-${Date.now()}`,
      admin_feedback: null,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setComplaints(prev => [compObj, ...prev]);

    try {
      const { error } = await supabase.from('complaints').insert([compObj]);
      if (error) {
        console.error('Supabase error inserting complaint:', error);
        addToast('error', error.message, 'Database Error');
        return false;
      }
      addToast('success', 'Grievance submitted directly to Supabase redressal queue.', 'Grievance Logged');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to submit grievance', 'Error');
      return false;
    }
  };

  const submitAdminFeedback = async (
    complaintId: string,
    feedback: string,
    newStatus: ComplaintStatus
  ): Promise<boolean> => {
    // Optimistic UI update
    setComplaints(prev => 
      prev.map(c => c.id === complaintId ? { ...c, admin_feedback: feedback, status: newStatus } : c)
    );

    try {
      const { error } = await supabase
        .from('complaints')
        .update({ admin_feedback: feedback, status: newStatus })
        .eq('id', complaintId);

      if (error) {
        console.error('Supabase error updating complaint:', error);
        addToast('error', error.message, 'Database Error');
        return false;
      }
      addToast('success', 'Official resolution feedback saved in backend.', 'Feedback Synced');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to update feedback', 'Error');
      return false;
    }
  };

  // ==========================================
  // Supabase Real-time Subscriptions
  // ==========================================
  useEffect(() => {
    fetchNotices();
    fetchBuses();
    fetchFoodItems();
    fetchLostFound();
    fetchComplaints();
    fetchOrders();
    fetchSeatBookings();

    // Subscribe to Postgres database realtime events
    const noticesChannel = supabase
      .channel('realtime:notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
        fetchNotices();
      })
      .subscribe();

    const busesChannel = supabase
      .channel('realtime:buses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buses' }, () => {
        fetchBuses();
      })
      .subscribe();

    const seatBookingsChannel = supabase
      .channel('realtime:bus_seat_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bus_seat_bookings' }, () => {
        fetchSeatBookings();
      })
      .subscribe();

    const complaintsChannel = supabase
      .channel('realtime:complaints')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        fetchComplaints();
      })
      .subscribe();

    const lostFoundChannel = supabase
      .channel('realtime:lost_found_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_found_items' }, () => {
        fetchLostFound();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(noticesChannel);
      supabase.removeChannel(busesChannel);
      supabase.removeChannel(seatBookingsChannel);
      supabase.removeChannel(complaintsChannel);
      supabase.removeChannel(lostFoundChannel);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        notices,
        loadingNotices,
        addNotice,
        deleteNotice,
        refetchNotices: fetchNotices,
        buses,
        loadingBuses,
        updateBusStatus,
        refetchBuses: fetchBuses,
        seatBookings,
        loadingSeatBookings,
        bookSeat,
        cancelSeatBooking,
        refetchSeatBookings: fetchSeatBookings,
        foodItems,
        loadingFood,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        checkoutCart,
        orders,
        refetchOrders: fetchOrders,
        lostFoundItems,
        loadingLostFound,
        reportLostFound,
        refetchLostFound: fetchLostFound,
        complaints,
        loadingComplaints,
        submitComplaint,
        submitAdminFeedback,
        refetchComplaints: fetchComplaints,
        toasts,
        addToast,
        removeToast,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isInstallModalOpen,
        setIsInstallModalOpen,
        triggerInstallApp,
        isAppInstalled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
