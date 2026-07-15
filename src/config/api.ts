
export type ApiConfig = {
 endpoints: {
    hobby: {
        list: () => string;
        times: () => string;
        details: () => string;
        addTimes: () => string;
        addHobby: () => string;
        delete: (hobbyId: number) => string;
    },
    auth: {
        init: () => string;
    }
 } 
};


function getEnv(name: string): string | undefined {
    return (globalThis as any)?.process?.env?.[name];
}

function getBaseUrl(): string {
    const envBaseUrl = getEnv('REACT_APP_HOBBIES_BASE_URL') ?? getEnv('HOBBIES_BASE_URL');
    if (envBaseUrl) {
        return envBaseUrl.replace(/\/$/, '');
    }

    if (typeof window !== 'undefined' && window.location?.hostname) {
        return `${window.location.protocol}//${window.location.hostname}:5001/api/v1`;
    }

    return 'http://localhost:5001/api/v1';
}

const baseUrl = getBaseUrl();

export const apiConfig: ApiConfig = {
    endpoints: {
        hobby: {
            list: () => `${baseUrl}/hobby/`,
            times: () => `${baseUrl}/hobby/times`,
            details: () => `${baseUrl}/hobby/details`,
            addTimes: () => `${baseUrl}/hobby/add_time`,
            addHobby: () => `${baseUrl}/hobby/add`,
            delete: (hobbyId) => `${baseUrl}/hobby/deleteHobby/${hobbyId}`,
        },
        auth: {
            init: () => `${baseUrl}/auth/init`
        }
    }
 };
