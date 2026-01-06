/**
 * Utility functions for working with cookies in the client-side
 */

/**
 * Gets the value of a cookie by name
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        // Remove leading spaces
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        
        // Check if this is the cookie we're looking for
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    
    return null;
}

/**
 * Checks if the user is authenticated by verifying username cookie
 * Note: access_cookie is HttpOnly and cannot be accessed from JavaScript for security reasons
 * If username exists, it means the user successfully logged in
 * @returns true if username cookie exists, false otherwise
 */
export function checkAuthentication(): boolean {
    if (typeof document === 'undefined') {
        return false;
    }
    
    // Solo verificar username ya que access_cookie es HttpOnly y no es accesible desde JavaScript
    // Si username existe, significa que el usuario hizo login exitosamente
    const username = getCookieValue('username');
    const result = !!username;
    
    return result;
}

