import react, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";

const ConversionHistory = ({
  conversionHistory,
  setConversionHistory,
  onDelete,
}) => {

  // delete the row 
  const handleDelete = (index) => {
    console.log("Index value", index);
    onDelete(index);
  };

  // get the conversion history from local storage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("conversionHistory"));
    if (storedHistory) {
      setConversionHistory(storedHistory);
    }
  }, []);

  return (
    <div className="currencyConversion">
      <h1> ConversionHistory </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow className="tableHeaderText">
              <TableCell>Date</TableCell>
              <TableCell align="left">Event</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conversionHistory?.map((conversion, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {conversion.date}
                </TableCell>
                <TableCell>
                  converted an {conversion.amount} from
                  {conversion.fromCurrency} to {conversion.toCurrency}
                </TableCell>
                <TableCell className="tableRow">
                  <Button sx={{ textTransform: "none" }}>
                    <VisibilityIcon className="iconColor" /> View
                  </Button>
                  <Button
                    onClick={() => handleDelete(index)}
                    sx={{ textTransform: "none" }}
                    className="deleteButton"
                  >
                    <DeleteIcon /> Delete From History
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ConversionHistory;
