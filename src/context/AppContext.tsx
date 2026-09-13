import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase, FALLBACK_BUSES, FALLBACK_COMPLAINTS, FALLBACK_FOOD_ITEMS, FALLBACK_LOST_FOUND, FALLBACK_NOTICES, FALLBACK_SEAT_BOOKINGS } from '../lib/supabaseClient';
import { playNotificationChime } from '../lib/realtimeSound';
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
  ToastNotification,
  ThemeMode,
  Language
} from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Language (English / বাংলা)
  language: Language;
  setLanguage: (lang: Language) => void;

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
  updateSeatBookingStatus: (bookingId: string, status: 'pending' | 'confirmed' | 'rejected', notes?: string) => Promise<boolean>;
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
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('gub_theme');
    if (saved === 'light' || saved === 'pink' || saved === 'dark') {
      return saved as ThemeMode;
    }
    return 'dark';
  });

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('gub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'pink';
      return 'dark';
    });
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Language State (Default: 'bn' or 'en' - saved in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('campus360_lang');
    if (saved === 'bn' || saved === 'en') {
      return saved as Language;
    }
    return 'bn';
  });

  useEffect(() => {
    localStorage.setItem('campus360_lang', language);
  }, [language]);

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
    const isDemo = Boolean(profile?.is_demo);
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_demo', isDemo)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notices query notice:', error.message);
        setNotices(isDemo ? FALLBACK_NOTICES.map(n => ({ ...n, is_demo: true })) : []);
      } else if (data && data.length > 0) {
        setNotices(data as Notice[]);
      } else {
        setNotices(isDemo ? FALLBACK_NOTICES.map(n => ({ ...n, is_demo: true })) : []);
      }
    } catch {
      setNotices(isDemo ? FALLBACK_NOTICES.map(n => ({ ...n, is_demo: true })) : []);
    } finally {
      setLoadingNotices(false);
    }
  };

  const addNotice = async (newNotice: Omit<Notice, 'id' | 'created_at'>): Promise<boolean> => {
    const isDemo = Boolean(profile?.is_demo);
    const id = `n-${Date.now()}`;
    const noticeObj: Notice = {
      ...newNotice,
      id,
      is_demo: isDemo,
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
      addToast('success', 'Bus route schedule updated in Supabase.', 'Fleet Updated');
      return true;
    } catch (err: unknown) {
      const e = err as Error;
      addToast('error', e.message || 'Failed to update bus', 'Error');
      return false;
    }
  };

  // ==========================================
  // 2.5 Bus Seat Bookings (Cloud Supabase + Realtime Cross-Device Sync)
  // Partitioned by is_demo (Demo Sandbox vs Real Live Passenger Bookings)
  // ==========================================
  const getBookingStorageKey = (isDemoAccount?: boolean) => {
    return isDemoAccount ? 'gub_bus_seat_bookings_demo' : 'gub_bus_seat_bookings_real';
  };

  const [seatBookings, setSeatBookings] = useState<BusSeatBooking[]>(() => {
    try {
      const isDemoAccount = Boolean(profile?.is_demo);
      const saved = localStorage.getItem(getBookingStorageKey(isDemoAccount));
      if (saved) return JSON.parse(saved);
      return isDemoAccount ? FALLBACK_SEAT_BOOKINGS.map(b => ({ ...b, is_demo: true })) : [];
    } catch {
      return Boolean(profile?.is_demo) ? FALLBACK_SEAT_BOOKINGS.map(b => ({ ...b, is_demo: true })) : [];
    }
  });
  const [loadingSeatBookings, setLoadingSeatBookings] = useState(true);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const crossDeviceChannelRef = useRef<any>(null);

  // Sync to localStorage with partitioned key
  useEffect(() => {
    try {
      const isDemoAccount = Boolean(profile?.is_demo);
      localStorage.setItem(getBookingStorageKey(isDemoAccount), JSON.stringify(seatBookings));
    } catch (e) {
      console.warn('Failed to persist seat bookings to localStorage', e);
    }
  }, [seatBookings, profile?.is_demo]);

  // Two-Way Sync Engine: Merge cloud data with local data and backfill unsaved local data to cloud
  const syncLocalBookingsToCloud = async (bookingsToSync: BusSeatBooking[]) => {
    if (!bookingsToSync || bookingsToSync.length === 0) return;
    try {
      await supabase.from('bus_seat_bookings').upsert(bookingsToSync, { onConflict: 'id' });
    } catch (e) {
      console.warn('Cross-device backfill sync note:', e);
    }
  };

  const fetchSeatBookings = async () => {
    const isDemo = Boolean(profile?.is_demo);
    try {
      const { data, error } = await supabase
        .from('bus_seat_bookings')
        .select('*')
        .eq('is_demo', isDemo)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSeatBookings(prev => {
          const bookingMap = new Map<string, BusSeatBooking>();
          // 1. Load local cache matching current environment
          prev.filter(b => Boolean(b.is_demo) === isDemo).forEach(b => {
            if (b.id) bookingMap.set(b.id, b);
          });
          // 2. Overwrite with fresh cloud data
          (data as BusSeatBooking[]).forEach(b => {
            if (b.id) bookingMap.set(b.id, b);
          });

          const merged = Array.from(bookingMap.values()).sort((a, b) => {
            const timeA = new Date(a.created_at || '').getTime() || 0;
            const timeB = new Date(b.created_at || '').getTime() || 0;
            return timeB - timeA;
          });

          // Check if there are local bookings that were not in cloud
          const cloudIds = new Set((data as BusSeatBooking[]).map(b => b.id));
          const missingInCloud = prev.filter(b => Boolean(b.is_demo) === isDemo && !cloudIds.has(b.id));
          if (missingInCloud.length > 0) {
            syncLocalBookingsToCloud(missingInCloud);
          }

          try {
            localStorage.setItem(getBookingStorageKey(isDemo), JSON.stringify(merged));
          } catch {}
          return merged;
        });
      } else if (error) {
        console.warn('Supabase fetch seat bookings note:', error.message);
      }
    } catch (err) {
      console.warn('Seat bookings fetch error:', err);
    } finally {
      setLoadingSeatBookings(false);
    }
  };

  // Real-time synchronization (Cross-Device Supabase Channel + BroadcastChannel + Postgres Changes + Sound Alerts)
  useEffect(() => {
    const currentIsDemo = Boolean(profile?.is_demo);
    const userRole = profile?.role;
    const userEmail = profile?.email;
    const studentId = profile?.id_no;

    // 1. Local same-device BroadcastChannel (persistent ref)
    let localBc: BroadcastChannel | null = null;
    try {
      localBc = new BroadcastChannel('gub_bus_realtime_channel');
      broadcastChannelRef.current = localBc;
      localBc.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        // Multi-tenant check: discard if message belongs to the other environment
        if (data.is_demo !== undefined && Boolean(data.is_demo) !== currentIsDemo) {
          return;
        }

        if (data.type === 'NEW_BOOKING' && data.booking) {
          const incoming = data.booking as BusSeatBooking;
          if (Boolean(incoming.is_demo) !== currentIsDemo) return;

          setSeatBookings(prev => {
            if (prev.some(b => b.id === incoming.id || (b.token_id && b.token_id === incoming.token_id))) return prev;
            return [incoming, ...prev];
          });

          // Conductor real-time alert with sound
          if (userRole === 'conductor' || userRole === 'admin') {
            playNotificationChime('request');
            addToast(
              'info',
              `🔔 New Ticket Request: Token #${incoming.token_id || incoming.id.slice(0, 8)} from ${incoming.student_name} (${incoming.student_id}) — Seat #${incoming.seat_number}!`,
              'Seat Request Received'
            );
          }
        } else if (data.type === 'STATUS_UPDATE') {
          setSeatBookings(prev =>
            prev.map(b => (b.id === data.bookingId || (b.token_id && b.token_id === data.token_id) ? { ...b, status: data.status, conductor_notes: data.notes } : b))
          );
          if (data.status === 'confirmed') {
            const isMyBooking = (data.user_email && data.user_email === userEmail) || (data.student_id && data.student_id === studentId) || userRole === 'student';
            if (isMyBooking) {
              playNotificationChime('confirmed');
              addToast('success', `✓ Conductor approved your bus pass (Token #${data.token_id || data.bookingId})! Seat #${data.seat_number || ''}`, 'Seat Pass Verified');
            }
          }
        } else if (data.type === 'CANCEL_BOOKING') {
          setSeatBookings(prev => prev.filter(b => b.id !== data.bookingId));
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    // 2. Cross-Device Supabase Realtime Channel
    const crossDeviceChannel = supabase.channel('gub_bus_live_network', {
      config: {
        broadcast: { ack: true }
      }
    });
    crossDeviceChannelRef.current = crossDeviceChannel;

    crossDeviceChannel
      .on('broadcast', { event: 'NEW_BOOKING' }, ({ payload }) => {
        if (!payload) return;
        const incoming = payload as BusSeatBooking;
        if (Boolean(incoming.is_demo) !== currentIsDemo) return;

        setSeatBookings(prev => {
          if (prev.some(b => b.id === incoming.id || (b.token_id && b.token_id === incoming.token_id))) return prev;
          return [incoming, ...prev];
        });

        // Conductor real-time alert with sound
        if (userRole === 'conductor' || userRole === 'admin') {
          playNotificationChime('request');
          addToast(
            'info',
            `🔔 New Ticket Request: Token #${incoming.token_id || incoming.id.slice(0, 8)} from ${incoming.student_name} (${incoming.student_id}) — Seat #${incoming.seat_number}!`,
            'Seat Request Received'
          );
        }
      })
      .on('broadcast', { event: 'STATUS_UPDATE' }, ({ payload }) => {
        if (!payload) return;
        if (payload.is_demo !== undefined && Boolean(payload.is_demo) !== currentIsDemo) return;
        const { bookingId, token_id, status, notes, seat_number, user_email, student_id: payloadStudentId } = payload;
        setSeatBookings(prev =>
          prev.map(b => (b.id === bookingId || (b.token_id && b.token_id === token_id) ? { ...b, status, conductor_notes: notes } : b))
        );
        if (status === 'confirmed') {
          const isMyBooking = (user_email && user_email === userEmail) || (payloadStudentId && payloadStudentId === studentId) || userRole === 'student';
          if (isMyBooking) {
            playNotificationChime('confirmed');
            addToast('success', `✓ Conductor approved your bus pass (Token #${token_id || bookingId})! Seat #${seat_number || ''}`, 'Seat Pass Verified');
          }
        }
      })
      .on('broadcast', { event: 'CANCEL_BOOKING' }, ({ payload }) => {
        if (!payload) return;
        if (payload.is_demo !== undefined && Boolean(payload.is_demo) !== currentIsDemo) return;
        const { bookingId } = payload;
        setSeatBookings(prev => prev.filter(b => b.id !== bookingId));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bus_seat_bookings' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newBooking = payload.new as BusSeatBooking;
          if (Boolean(newBooking.is_demo) !== currentIsDemo) return;
          setSeatBookings(prev => {
            if (prev.some(b => b.id === newBooking.id || (b.token_id && b.token_id === newBooking.token_id))) return prev;
            return [newBooking, ...prev];
          });
          if (userRole === 'conductor' || userRole === 'admin') {
            playNotificationChime('request');
            addToast(
              'info',
              `🔔 New Ticket Request: Token #${newBooking.token_id || newBooking.id.slice(0, 8)} from ${newBooking.student_name} (${newBooking.student_id}) — Seat #${newBooking.seat_number}!`,
              'Seat Request Received'
            );
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedBooking = payload.new as BusSeatBooking;
          if (Boolean(updatedBooking.is_demo) !== currentIsDemo) return;
          setSeatBookings(prev =>
            prev.map(b => (b.id === updatedBooking.id ? updatedBooking : b))
          );
          if (updatedBooking.status === 'confirmed') {
            const isMyBooking = (updatedBooking.user_email && updatedBooking.user_email === userEmail) || (updatedBooking.student_id && updatedBooking.student_id === studentId) || userRole === 'student';
            if (isMyBooking) {
              playNotificationChime('confirmed');
              addToast('success', `✓ Conductor approved your bus pass (Token #${updatedBooking.token_id || updatedBooking.id})! Seat #${updatedBooking.seat_number}`, 'Seat Pass Verified');
            }
          }
        } else if (payload.eventType === 'DELETE') {
          const delId = payload.old.id;
          setSeatBookings(prev => prev.filter(b => b.id !== delId));
        }
      })
      .subscribe();

    // 3. Same-window custom event listener (instant 0ms dispatch)
    const handleLocalCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      if (!detail) return;
      if (detail.type === 'NEW_BOOKING' && detail.booking) {
        if (userRole === 'conductor' || userRole === 'admin') {
          playNotificationChime('request');
          addToast(
            'info',
            `🔔 New Ticket Request: Token #${detail.booking.token_id || detail.booking.id.slice(0, 8)} from ${detail.booking.student_name} (${detail.booking.student_id}) — Seat #${detail.booking.seat_number}!`,
            'Seat Request Received'
          );
        }
      } else if (detail.type === 'STATUS_UPDATE' && detail.status === 'confirmed') {
        const isMyBooking = (detail.user_email && detail.user_email === userEmail) || (detail.student_id && detail.student_id === studentId) || userRole === 'student';
        if (isMyBooking) {
          playNotificationChime('confirmed');
          addToast('success', `✓ Conductor approved your bus pass (Token #${detail.token_id || detail.bookingId})!`, 'Seat Pass Verified');
        }
      }
    };
    window.addEventListener('gub_bus_sync', handleLocalCustomSync);

    // 4. Cross-tab storage event listener
    const storageKey = getBookingStorageKey(currentIsDemo);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSeatBookings(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 5. Window focus listener: Re-sync when switching between tabs/apps
    const handleWindowFocus = () => {
      fetchSeatBookings();
    };
    window.addEventListener('focus', handleWindowFocus);

    // 6. Periodic background heartbeat sync (every 5 seconds)
    const syncInterval = setInterval(() => {
      fetchSeatBookings();
    }, 5000);

    return () => {
      window.removeEventListener('gub_bus_sync', handleLocalCustomSync);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(syncInterval);
      if (localBc) {
        localBc.close();
        broadcastChannelRef.current = null;
      }
      supabase.removeChannel(crossDeviceChannel);
      crossDeviceChannelRef.current = null;
    };
  }, [profile?.is_demo, profile?.email, profile?.role, profile?.id_no]);

  const bookSeat = async (
    bookingData: Omit<BusSeatBooking, 'id' | 'created_at'>
  ): Promise<{ success: boolean; message?: string; booking?: BusSeatBooking }> => {
    const isDemo = Boolean(profile?.is_demo);
    // Check if seat is already occupied for this specific bus, trip slot, and direction on the same booking date in the active environment
    const isOccupied = seatBookings.some(
      b =>
        b.bus_id === bookingData.bus_id &&
        b.trip_slot === bookingData.trip_slot &&
        b.direction === bookingData.direction &&
        b.seat_number === bookingData.seat_number &&
        b.booking_date === bookingData.booking_date &&
        b.status !== 'rejected' &&
        Boolean(b.is_demo) === isDemo
    );

    if (isOccupied) {
      addToast('error', `Seat #${bookingData.seat_number} has already been reserved by another student!`, 'Seat Unavailable');
      return { success: false, message: 'Seat already reserved' };
    }

    const bookingId = `bk-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const generatedToken = bookingData.token_id || `GUB-TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullBooking: BusSeatBooking = {
      status: 'pending',
      ...bookingData,
      token_id: generatedToken,
      id: bookingId,
      is_demo: isDemo,
      created_at: new Date().toISOString()
    };

    // Optimistically update state and localStorage
    setSeatBookings(prev => {
      const next = [fullBooking, ...prev.filter(b => b.id !== fullBooking.id)];
      try {
        localStorage.setItem(getBookingStorageKey(isDemo), JSON.stringify(next));
      } catch {}
      return next;
    });

    // 1. Cross-Device Supabase Broadcast
    try {
      if (crossDeviceChannelRef.current) {
        crossDeviceChannelRef.current.send({
          type: 'broadcast',
          event: 'NEW_BOOKING',
          payload: { ...fullBooking, is_demo: isDemo }
        });
      } else {
        supabase.channel('gub_bus_live_network').send({
          type: 'broadcast',
          event: 'NEW_BOOKING',
          payload: { ...fullBooking, is_demo: isDemo }
        });
      }
    } catch (e) {
      console.warn('Supabase cross-device broadcast error:', e);
    }

    // 2. Same-Device BroadcastChannel (keep channel open)
    try {
      broadcastChannelRef.current?.postMessage({ type: 'NEW_BOOKING', booking: fullBooking, is_demo: isDemo });
    } catch {}

    // 3. Same-window custom event (0ms instant trigger)
    window.dispatchEvent(new CustomEvent('gub_bus_sync', { detail: { type: 'NEW_BOOKING', booking: fullBooking, is_demo: isDemo } }));

    // 4. Soft audio chime for pending request placed
    playNotificationChime('pending');

    // 5. Upsert to Supabase Cloud Database
    try {
      const { error } = await supabase.from('bus_seat_bookings').upsert([fullBooking], { onConflict: 'id' });
      if (error) {
        console.warn('Supabase bus_seat_bookings upsert note:', error.message);
      }
      addToast(
        'info',
        `Seat #${fullBooking.seat_number} request submitted. Awaiting Conductor approval in real time! Token: ${fullBooking.token_id}`,
        'Request Submitted (Pending)'
      );
      return { success: true, booking: fullBooking };
    } catch {
      addToast(
        'info',
        `Seat #${fullBooking.seat_number} request saved. Awaiting Conductor approval. Token: ${fullBooking.token_id}`,
        'Request Submitted (Pending)'
      );
      return { success: true, booking: fullBooking };
    }
  };

  const updateSeatBookingStatus = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'rejected',
    notes?: string
  ): Promise<boolean> => {
    const isDemo = Boolean(profile?.is_demo);
    let updatedBookingObj: BusSeatBooking | undefined;

    setSeatBookings(prev => {
      const next = prev.map(b => {
        if (b.id === bookingId) {
          updatedBookingObj = { ...b, status, conductor_notes: notes };
          return updatedBookingObj;
        }
        return b;
      });
      try {
        localStorage.setItem(getBookingStorageKey(isDemo), JSON.stringify(next));
      } catch {}
      return next;
    });

    const updatePayload = {
      bookingId,
      token_id: updatedBookingObj?.token_id,
      status,
      notes,
      is_demo: isDemo,
      seat_number: updatedBookingObj?.seat_number,
      student_id: updatedBookingObj?.student_id,
      user_email: updatedBookingObj?.user_email
    };

    // 1. Cross-Device Supabase Broadcast
    try {
      if (crossDeviceChannelRef.current) {
        crossDeviceChannelRef.current.send({
          type: 'broadcast',
          event: 'STATUS_UPDATE',
          payload: updatePayload
        });
      } else {
        supabase.channel('gub_bus_live_network').send({
          type: 'broadcast',
          event: 'STATUS_UPDATE',
          payload: updatePayload
        });
      }
    } catch (e) {
      console.warn('Cross-device status broadcast error:', e);
    }

    // 2. Same-Device BroadcastChannel (keep channel open)
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'STATUS_UPDATE',
        ...updatePayload
      });
    } catch {}

    // 3. Same-window custom event (0ms instant trigger)
    window.dispatchEvent(new CustomEvent('gub_bus_sync', {
      detail: {
        type: 'STATUS_UPDATE',
        ...updatePayload
      }
    }));

    // 4. Update Supabase Cloud Database
    try {
      const { error } = await supabase
        .from('bus_seat_bookings')
        .update({ status, conductor_notes: notes })
        .eq('id', bookingId);

      if (error) {
        console.warn('Supabase bus booking status update note:', error.message);
      }

      if (status === 'confirmed') {
        addToast('success', `Seat Token #${updatedBookingObj?.token_id || bookingId} approved! Verified by Conductor.`, 'Booking Confirmed');
      } else if (status === 'rejected') {
        addToast('warning', `Seat Token #${updatedBookingObj?.token_id || bookingId} request declined.`, 'Booking Declined');
      }
      return true;
    } catch {
      return true;
    }
  };

  const cancelSeatBooking = async (id: string): Promise<boolean> => {
    const isDemo = Boolean(profile?.is_demo);
    setSeatBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      try {
        localStorage.setItem(getBookingStorageKey(isDemo), JSON.stringify(next));
      } catch {}
      return next;
    });

    // 1. Cross-Device Supabase Broadcast
    try {
      if (crossDeviceChannelRef.current) {
        crossDeviceChannelRef.current.send({
          type: 'broadcast',
          event: 'CANCEL_BOOKING',
          payload: { bookingId: id, is_demo: isDemo }
        });
      } else {
        supabase.channel('gub_bus_live_network').send({
          type: 'broadcast',
          event: 'CANCEL_BOOKING',
          payload: { bookingId: id, is_demo: isDemo }
        });
      }
    } catch {}

    // 2. Same-Device BroadcastChannel
    try {
      broadcastChannelRef.current?.postMessage({ type: 'CANCEL_BOOKING', bookingId: id, is_demo: isDemo });
    } catch {}

    // 3. Same-window custom event
    window.dispatchEvent(new CustomEvent('gub_bus_sync', { detail: { type: 'CANCEL_BOOKING', bookingId: id, is_demo: isDemo } }));

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
    const isDemo = Boolean(profile?.is_demo);
    try {
      let query = supabase.from('orders').select('*').eq('is_demo', isDemo).order('created_at', { ascending: false });
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

    const isDemo = Boolean(profile?.is_demo);
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
      ordered_by: profile?.email || (isDemo ? 'student@green.edu.bd' : 'student@student.green.ac.bd'),
      date: new Date().toISOString().split('T')[0],
      is_demo: isDemo,
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
    const isDemo = Boolean(profile?.is_demo);
    try {
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*')
        .eq('is_demo', isDemo)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch lost_found notice:', error.message);
        setLostFoundItems(isDemo ? FALLBACK_LOST_FOUND.map(l => ({ ...l, is_demo: true })) : []);
      } else if (data && data.length > 0) {
        setLostFoundItems(data as LostFoundItem[]);
      } else {
        setLostFoundItems(isDemo ? FALLBACK_LOST_FOUND.map(l => ({ ...l, is_demo: true })) : []);
      }
    } catch {
      setLostFoundItems(isDemo ? FALLBACK_LOST_FOUND.map(l => ({ ...l, is_demo: true })) : []);
    } finally {
      setLoadingLostFound(false);
    }
  };

  const reportLostFound = async (item: Omit<LostFoundItem, 'id' | 'created_at'>): Promise<boolean> => {
    const isDemo = Boolean(profile?.is_demo);
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      is_demo: isDemo,
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
    const isDemo = Boolean(profile?.is_demo);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('is_demo', isDemo)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch complaints notice:', error.message);
        setComplaints(isDemo ? FALLBACK_COMPLAINTS.map(c => ({ ...c, is_demo: true })) : []);
      } else if (data && data.length > 0) {
        setComplaints(data as Complaint[]);
      } else {
        setComplaints(isDemo ? FALLBACK_COMPLAINTS.map(c => ({ ...c, is_demo: true })) : []);
      }
    } catch {
      setComplaints(isDemo ? FALLBACK_COMPLAINTS.map(c => ({ ...c, is_demo: true })) : []);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const submitComplaint = async (
    newComplaint: Omit<Complaint, 'id' | 'created_at' | 'admin_feedback'>
  ): Promise<boolean> => {
    const isDemo = Boolean(profile?.is_demo);
    const compObj: Complaint = {
      ...newComplaint,
      id: `c-${Date.now()}`,
      admin_feedback: null,
      is_demo: isDemo,
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
  }, [profile?.is_demo, profile?.email]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
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
        updateSeatBookingStatus,
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
