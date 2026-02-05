
class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Este browser não suporta notificações.');
      return 'denied';
    }

    if (this.permission === 'default') {
      const permissionResult = await Notification.requestPermission();
      this.permission = permissionResult;
      return permissionResult;
    }
    
    return this.permission;
  }

  public sendNotification(title: string, options?: NotificationOptions): void {
    if (this.permission !== 'granted') {
      console.log('Permissão de notificação não concedida.');
      return;
    }
    
    // Only send notification if the user is not on the tab
    if (document.hidden) {
        const iconDataUri = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23dc2626%22></rect><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2260%22 font-weight=%22bold%22 fill=%22white%22>P</text></svg>";

        const notification = new Notification(title, {
            ...options,
            icon: options?.icon || iconDataUri,
            badge: iconDataUri, // For Android
        });
    }
  }
}

export const notificationService = new NotificationService();
