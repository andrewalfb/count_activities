
export type ApiConfig = {
 endpoints: {
    hobby: {
        list: () => string;
        times: () => string;
        details: () => string;
        addTimes: () => string;
        addHobby: () => string;
    },
    auth: {
        init: () => string;
    }
 } 
};


function getEnv(name: string): string | undefined {
    return (globalThis as any)?.process?.env?.[name];
}

const baseUrl = getEnv('HOBBIES_BASE_URL') ??
    "http://localhost:5001/api/v1";

export const apiConfig: ApiConfig = {
    endpoints: {
        hobby: {
            list: () => `${baseUrl}/hobby/`,
            times: () => `${baseUrl}/hobby/times`,
            details: () => `${baseUrl}/hobby/details`,
            addTimes: () => `${baseUrl}/hobby/add_time`,
            addHobby: () => `${baseUrl}/hobby/add`
        },
        auth: {
            init: () => `${baseUrl}/auth/init`
        }
    }
 };