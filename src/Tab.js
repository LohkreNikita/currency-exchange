import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Box, Paper } from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import "./App.css";
import ConversionHistory from "./ConversionHistory";
import CurrencyConversion from "./CurrencyConversion";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = useState(1);
  const [conversionHistory, setConversionHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("conversionHistory"));
    if (storedHistory) {
      setConversionHistory(storedHistory);
    }
  }, []);

  const handleDelete = (index) => {
    setConversionHistory((prevHistory) =>
      prevHistory.filter((_, i) => i !== index)
    );
  };

  const handleValuew = (value) => {
    setValue(value);
  };

  return (
    <div >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          centered
          aria-label="wrapped label tabs example"
          onChange={(event, newValue) => handleValuew(newValue)}
        >
          <Tab
            icon={<FindReplaceIcon className="iconColor" />}
            iconPosition="start"
            label="Currency Exchange"
            wrapped
            className="tabStyle"
          />
          <Tab label="CURRENCY CONVERTER" wrapped className="tabStyle" />
          <Tab label="VIEW CONVERSION HISTORY" wrapped className="tabStyle" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <div className="center">Currency Exchange App</div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CurrencyConversion
          setConversionHistory={setConversionHistory}
          conversionHistory={conversionHistory}
          onDelete={handleDelete}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ConversionHistory
          setConversionHistory={setConversionHistory}
          conversionHistory={conversionHistory}
          onDelete={handleDelete}
        />
      </TabPanel>
    </div>
  );
}
