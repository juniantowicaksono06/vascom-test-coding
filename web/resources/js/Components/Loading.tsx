import { ClipLoader } from "react-spinners"
const Loading = (props: {
    isLoading: boolean
}) => {
    const show = props.isLoading ? "d-flex" : "d-none";
    return (
        <div id="loadingContainer" className={`${show} justify-content-center align-items-center`}>
            <ClipLoader color="#419fe4" loading={props.isLoading} size={80} aria-label="Loading Spinner" data-testid="loader" />
        </div>
    );
}

export default Loading