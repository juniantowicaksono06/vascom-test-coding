const getClientBaseURL = () => {
    return import.meta.env.VITE_API_BASE_URL || "localhost:8089"
}

const getApiBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api` || "localhost:8089"
}

export { getClientBaseURL, getApiBaseUrl }