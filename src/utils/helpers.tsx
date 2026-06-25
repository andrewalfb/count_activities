    
    
    export function formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const second = Math.floor(seconds % 60);
        
        const mm = String(minutes).padStart(2, '0');
        const ss = String(second).padStart(2, '0');

        return `${hours}:${mm}:${ss}`;
    }

    export function startOfLocalDay(ms = Date.now()): number {
        const day = new Date(ms);
        day.setHours(0,0,0,0);

        return day.getTime();
    }

    export function isTodayLocal(timestamp: number): boolean {
        return timestamp >= startOfLocalDay(); 
    }