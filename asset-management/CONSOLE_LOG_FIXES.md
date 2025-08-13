// Example of completely cleaned firebase.config.ts functions
// Replace ALL remaining console.logs with proper logging

// ✅ FIXED - Auth state change handler
export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        logAuth('Auth state changed - user signed in', { userId: firebaseUser.uid });
        
        const user: AppUser = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] || 'Unknown' : 'Unknown',
          lastName: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') || '' : '',
          email: firebaseUser.email || '',
          role: 'user' as UserRole,
          organizationId: '',
          permissions: [],
          isActive: true,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          lastLogin: firebaseUser.metadata.lastSignInTime || '',
          department: '',
          phone: '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
        };
        
        callback(user);
      } catch (error) {
        logError('Error in auth state change', error);
        callback(null);
      }
    } else {
      logAuth('Auth state changed - user signed out');
      callback(null);
    }
  });
};

// ✅ FIXED - Remove debug token function entirely or make it dev-only
export const debugToken = async (): Promise<void> => {
  // Only run in development with explicit debug flag
  if (!import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE !== 'true') {
    return;
  }
  
  try {
    const user = auth.currentUser;
    if (!user) {
      logDebug('No user signed in for token debug');
      return;
    }

    const token = await getIdToken(user, true);
    logDebug('Token debug info', {
      userUID: user.uid,
      userEmail: user.email,
      tokenLength: token.length
    });
    
    // Minimal token analysis - NO detailed logging
    const parts = token.split('.');
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        const timeToExpiry = payload.exp - now;
        logDebug('Token validity', { 
          validForMinutes: Math.floor(timeToExpiry / 60) 
        });
      } catch (parseError) {
        logError('Error parsing token for debug', parseError);
      }
    }
  } catch (error) {
    logError('Token debug failed', error);
  }
};
