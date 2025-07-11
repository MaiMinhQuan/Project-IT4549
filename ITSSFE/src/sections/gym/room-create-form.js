import PropTypes from "prop-types";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { wait } from "src/utils/wait";
import roomsApi from "src/api/rooms";

const initialValues = () => {
  return {
    name: "",
    address: "",
    acreage: 0,
    submit: null,
  };
};

export const RoomCreateForm = (props) => {
  const { onClose, createRoom, ...other } = props;

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object({
      address: Yup.string().max(255),
      name: Yup.string().max(255).required("Yêu cầu nhập tên phòng"),
      acreage: Yup.number().min(0).max(1000),
    }),
    onSubmit: async (values, helpers) => {
      try {
        createRoom(values);
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success("Thành công");
      } catch (err) {
        console.error(err);
        toast.error("Lỗi!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} {...other}>
      <Card sx={{ width: "400px" }}>
        <CardHeader title="Thêm phòng tập" />
        <CardContent sx={{ pt: 0 }}>
          <Stack container="true" spacing={3}>
            <TextField
              error={!!(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Tên phòng tập"
              name="name"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
            />
            <TextField
              error={!!(formik.touched.address && formik.errors.address)}
              fullWidth
              helperText={formik.touched.address && formik.errors.address}
              label="Địa chỉ"
              name="address"
              value={formik.values.address}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <TextField
              error={!!(formik.touched.acreage && formik.errors.acreage)}
              fullWidth
              helperText={formik.touched.acreage && formik.errors.acreage}
              label="Diện tích"
              name="acreage"
              value={formik.values.acreage}
              type="number"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Stack>
        </CardContent>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          flexWrap="wrap"
          spacing={3}
          sx={{ p: 3 }}
        >
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
            onClick={onClose}
          >
            Thêm
          </Button>
          <Button color="inherit" disabled={formik.isSubmitting} onClick={onClose}>
            Hủy
          </Button>
        </Stack>
      </Card>
    </form>
  );
};

RoomCreateForm.propTypes = {
  onClose: PropTypes.func,
};
