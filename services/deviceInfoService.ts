
import { DeviceInfo } from '../types';

class DeviceInfoService {

  private parseUserAgent(): { os: string, browser: string } {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    // OS Detection
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "MacOS";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS";

    // Browser Detection
    if (ua.indexOf("Chrome") > -1 && navigator.vendor.indexOf("Google Inc") > -1) {
      browser = "Chrome";
    } else if (ua.indexOf("Firefox") > -1) {
      browser = "Firefox";
    } else if (ua.indexOf("Safari") > -1 && navigator.vendor.indexOf("Apple") > -1) {
      browser = "Safari";
    } else if (ua.indexOf("Edg") > -1) {
      browser = "Edge";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
      browser = "Opera";
    }
    
    return { os, browser };
  }

  public async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      const ipResponse = await fetch('https://ip-api.com/json');
      if (!ipResponse.ok) throw new Error('Failed to fetch IP info');
      const ipData = await ipResponse.json();

      const { os, browser } = this.parseUserAgent();
      
      // Network Information API
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const connectionType = connection ? connection.type : 'N/A';
      const effectiveType = connection ? connection.effectiveType : 'N/A';

      // Geolocation API
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      if ('geolocation' in navigator) {
          try {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
              });
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
          } catch (geoError) {
              console.warn("Geolocation permission denied or timed out.");
          }
      }

      return {
        ip: ipData.query || 'N/A',
        city: ipData.city || 'N/A',
        country: ipData.country || 'N/A',
        isp: ipData.isp || 'N/A',
        connectionType,
        effectiveType,
        os,
        browser,
        latitude,
        longitude
      };
    } catch (error) {
      console.error("Error fetching device info:", error);
      const { os, browser } = this.parseUserAgent();
      return {
        ip: 'Error',
        city: 'Error',
        country: 'Error',
        isp: 'Error',
        connectionType: 'N/A',
        effectiveType: 'N/A',
        os,
        browser,
      };
    }
  }
}

export const deviceInfoService = new DeviceInfoService();
