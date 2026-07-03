
export type ApiConfig = {
 endpoints: {
    hobby: {
        list: () => string;
        times: () => string;
        addTimes: () => string;
        addHobby: () => string;
    }
 } 
};


function getEnv(name: string): string | undefined {
    return (globalThis as any)?.process?.env?.[name];
}

const baseUrl = getEnv('HOBBIES_BASE_URL') ??
    "http://192.168.10.101:5001/api/v1/hobby";

export const apiConfig: ApiConfig = {
    endpoints: {
        hobby: {
            list: () => `${baseUrl}/`,
            times: () => `${baseUrl}/times`,
            addTimes: () => `${baseUrl}/add_time`,
            addHobby: () => `${baseUrl}/add`
        }
    }
 };