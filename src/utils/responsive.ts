export function checkIsMobile(): boolean {
    return typeof window !== 'undefined' && window?.innerWidth <= 500;
} 