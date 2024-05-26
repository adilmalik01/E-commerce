import Swal from "sweetalert2";

const Alert = (props) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      container: "custom-swal-container",
    },
  });
  Toast.fire({
    icon: "success",
    title: `${props}`,
  });
};

export const RedAlert = (props) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      container: "custom-swal-container",
    },
  });
  Toast.fire({
    icon: "error",
    title: `${props}`,
  });
};

export default Alert;
