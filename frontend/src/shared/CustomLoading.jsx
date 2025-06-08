import { Dialog, DialogContent } from "@mui/material";
import { GridLoader } from "react-spinners";
import ReactDOM from "react-dom/client"

const Loader = ({ loading, message = "Please wait" }) => {
  return (
    <>
      <Dialog open={loading} maxWidth='sm'>
        <DialogContent className='flex flex-col align-middle items-center justify-center'>
          <GridLoader size={7} color='#0e2eb4' />
          <span className='mt-3'>{message}</span>
        </DialogContent>
      </Dialog>
    </>
  );
};

let root = null;
let container = null;

const customToggleLoading = ({ loading, message }) => {
  if (loading) {
    if (!container) {
      container = document.createElement("div");
      container.id = "loading-overlay";
      document.body.appendChild(container);
      root = ReactDOM.createRoot(container);
    }
    root.render(<Loader loading={true} message={message} />);
  } else {
    // Unmount and clean up if it exists
    if (root && container) {
      root.unmount();
      container.remove();
      root = null;
      container = null;
    }
  }
};

export { customToggleLoading };
