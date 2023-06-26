import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  Paper,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import moment from "moment";

import "./App.css";

const BASE_URL = "https://api.exchangerate.host";

function CurrencyConversion(props) {
  // Initializing all the state variables
  const [output, setOutput] = useState(0);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [duration, setDuration] = useState(7);
  const [exchangeRateHistory, setExchangeRateHistory] = useState([]);
  const [value, setValue] = useState("table");
  const [error, setErrorMessage] = useState();
  const [lowestRate, setLowestRate] = useState();
  const [highestRate, setHighestRate] = useState();
  const [averageRate, setAverageRate] = useState();
  const [conversionHistory, setConversionHistory] = useState([]);


  const selectDate = [
    {
      id: 7,
      value: "7 days",
    },
    {
      id: 14,
      value: "14 days",
    },
    {
      id: 30,
      value: "30 days",
    },
  ];

// to store the conversion history in local storage

  useEffect(() => {
    if(props.conversionHistory?.length){
      localStorage.setItem('conversionHistory', JSON.stringify(props.conversionHistory));
    }
  }, [props.conversionHistory]);

 // get the currency list

  useEffect(() => {
    fetch(`${BASE_URL}/latest`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions([...Object.keys(data.rates)]);
        // console.log("data from api", [...Object.keys(data.rates)]);
      })
      .catch((err) => console.log("There was an error:" + err));
  }, []);

   //  convert currency and get targeted currency

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      fetch(`${BASE_URL}/convert?from=${fromCurrency}&to=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          const result = data.result
          console.log("data for to currency", result);
          setExchangeRate(result);
          const newConversion = {
            amount,
            fromCurrency,
            toCurrency,
            result,
            date: moment().format("YYYY-MM-DD @ HH:mm")
          };

          if(amount !== 0 ){

            props.setConversionHistory((prevHistory) => [newConversion, ...prevHistory]);
            console.log('storage----->>>',newConversion )
          } 
    
        })
        .catch((err) => console.log("There was an error:" + err));
    } else {
      setErrorMessage("You cann't convert the same currency!");
    }
  }, [fromCurrency, toCurrency, output]);

// to get targeted currency rate during the period of time

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/timeseries?start_date=${startDate}&end_date=${endDate}`);
        const json = await response.json();
        const rates = json.rates;
        console.log('rates',rates)
        setExchangeRateHistory(rates);
        const temp = [];
        Object.entries(rates).map(([date, rates]) => {
          temp.push(rates[toCurrency])
        })
        const lowest = Math.min(...temp);
        setLowestRate(lowest);
        const high = Math.max(...temp);
        setHighestRate(high)
        console.log('highest',high)
        const Rates = rates[toCurrency]
        const sum = temp.reduce((acc, rate) => acc + rate, 0);
        const average = sum / temp.length;
        setAverageRate(average);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };
    fetchData();
  }, [exchangeRate,startDate]);

  // to get the duration of history currencyRate i.e 7days, 14days, 30dyas

  useEffect(() => {
    if (duration) {
      setStartDate(
        moment(moment().subtract(duration, "days").calendar()).format(
          "YYYY-MM-DD"
        )
      );

    }
  }, [duration]);

// use to convert the to fromCurrency to target currency

  const convert =() => {
    const result = amount * exchangeRate;
    setOutput(result);
  }

  // Switch the currency 

  const flip = () => {
    var temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  return (
    <div className="currencyConversion">
      <h1>I want to convert</h1>
      <Grid container spacing={2}>
        <Grid item xs={8} md={3}>
          <TextField
            id="standard-number"
            label="Amount"
            type="number"
            value={amount}
            inputProps={{min:0}}
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            fullWidth
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={8} md={3}>
          <TextField
            select
            label="From"
            defaultValue="USD"
            variant="standard"
            value={fromCurrency}
            fullWidth
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2} md={0.6}>
          <CompareArrowsIcon
            className="compareArrowIcon"
            onClick={() => {
              flip();
            }}
          />
        </Grid>
        <Grid item xs={8} md={3}>
          <TextField
            select
            label="To"
            defaultValue="EUR"
            variant="standard"
            fullWidth
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8} md={2.4}>
          <Button
            variant="contained"
            fullWidth
            sx={{textTransform: "none"}}
            className="button"
            onClick={() => {
              convert();
            }}
          >
            Convert
          </Button>
        </Grid>
      </Grid>

      <h1 className="Unbold center">
        <span>{`${amount} ${fromCurrency} = `}</span>
        <span className="currencyResult">
          {error ? error : `${output.toFixed(4)} ${toCurrency}`}
        </span>
      </h1>
      <div className="center">
        <text>{`1 ${fromCurrency} =  ${exchangeRate} ${toCurrency} `}</text>
      </div>

      <h2 className="exchangeHistoryTiltle">Exchange History</h2>
      <Grid container spacing={4} style={{marginBottom:'2%'}}>
        <Grid item xs={8} md={3}>
          <TextField
            select
            label="To"
            variant="standard"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            {selectDate.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8} md={4}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="table"
            name="radio-buttons-group"
            row
            onChange={handleChange}
          >
            <FormControlLabel value="table" control={<Radio />} label="Table" />
            <FormControlLabel value="chart" control={<Radio />} label="chart" />
          </RadioGroup>
        </Grid>
      </Grid>

      {value === "table" ? (
        <Grid container spacing={1}>
          <Grid item xs={8} md={6}>
            <Table
              sx={{ minWidth: 200 }}
              aria-label="simple table"
              component={Paper}
              size="large"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Exchange Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(exchangeRateHistory).map(([date, rates]) => (
                  <TableRow key={date}>
                    <TableCell component="th" scope="row">
                      {date}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {rates[toCurrency]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={8} md={6}>
            <Table
              sx={{ minWidth: 200 }}
              aria-label="simple table"
              component={Paper}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Statistics</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Lowest
                  </TableCell>
                  <TableCell> {lowestRate !== null ?  lowestRate : 'no value'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Highest</TableCell>
                  <TableCell>{highestRate !== null ?  highestRate : 'no value'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">average </TableCell>
                  <TableCell>{averageRate !== null ?  averageRate : 'no value'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      ) : (
        <div className="center">This feature is not available for this moment</div>
      ) }
    </div>
  );
}

export default CurrencyConversion;
