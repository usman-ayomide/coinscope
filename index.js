import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
let coinList = [];

app.use(express.static("public"));

async function loadCoinList() {
    try{
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/list?include_platform=false"
        );
        coinList = response.data;
        console.log(`Loaded ${coinList.length} coins`);   
    }
    catch(error){
        console.log("Failed to load coin data list:", error.message);
    }
    
}
loadCoinList();


app.get("/", async (req, res) => {
    try{
        const selectedCoin = String(req.query.coin || "bitcoin").trim().toLowerCase();
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${selectedCoin}`
        );
        const coinData = response.data[0] || null;
        const error = coinData ? null : "That coin is unavailable";   
        
        res.render("index.ejs", {
            data:  coinData, selectedCoin: selectedCoin, error: error, coins: coinList
        });
    }
    catch(error){
        console.error("Failed to fetch prices", error.message || error);

        res.render("index.ejs", {
            error: error.message, selectedCoin: "bitcoin", data: null, coins: []
        });
    }
});

app.listen(port, () => {
    console.log(`Running server on ${port}`);
});