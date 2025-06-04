const { parseISO, isSameMonth } = require("date-fns");
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  useMediaQuery,
  Stack,
  Typography,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const UserCalendar = (props) => {
  const { activity = [], ...other } = props;
  // console.log("activity in UserCalendar", activity);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const date = new Date();

  // const onChange = (selectedDate) => {
  //   // setDate(selectedDate);
  // };
  let markedDates = [];
  // if (activity && activity.process)
  //   markedDates = activity.process.map((item) => item.createdAt.slice(0, 10));

  if (activity) markedDates = activity.map((item) => item.created_at.slice(0, 10));
  //console.log("markedDates", markedDates);

  // const tileContent = ({ date }) => {
  //   if (markedDates.includes(date.toISOString().slice(0, 10))) {
  //     return (
  //       <div
  //         style={{
  //           backgroundColor: "red",
  //           borderRadius: "50%",
  //           width: "80%",
  //           height: "80%",
  //           margin: "10%",
  //         }}
  //       />
  //     );
  //   }
  // };
  const tileContent = ({ date }) => {
    // Chuyển ngày thành chuỗi định dạng YYYY-MM-DD theo múi giờ địa phương
    const formattedDate = date.toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD
    if (markedDates.includes(formattedDate)) {
      return (
        <div
          style={{
            backgroundColor: "red",
            borderRadius: "50%",
            width: "80%",
            height: "80%",
            margin: "10%",
          }}
        />
      );
    }
  };

  let count = 0;

  // if (activity && activity.process)
  //   activity.process.forEach((item) => {
  //     const createdAt = parseISO(item.createdAt);
  //     if (isSameMonth(createdAt, date)) {
  //       count++;
  //     }
  //   });

  if (activity)
    activity.forEach((item) => {
      const created_at = parseISO(item.created_at);
      if (isSameMonth(created_at, date)) {
        count++;
      }
    });

  return (
    <Card {...props}>
      <CardHeader title="Lịch" />
      <Stack container spacing={4}>
        <Box display="flex" justifyContent="center">
          <Calendar
            value={date}
            // onChange={onChange}
            tileContent={tileContent}
          />
        </Box>
        <Typography variant="body1" align="center">
          {`Tháng này bạn có ${count} buổi tập. Hãy cố gắng lên nhé !`}
        </Typography>
      </Stack>
    </Card>
  );
};
