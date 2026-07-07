import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

const coingecko = axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
    headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
});

//save response from coingecko
let coinList = [];

app.use(express.static("public"));


async function loadCoinList() {
    //get the response from coingecko and push it into coinList
    const response = await coingecko.get("/coins/markets", { 
        params: {include_platform: false}
    });
    coinList = response.data;
    console.log(`Loaded ${coinList.length} coins`);
}

//handle all axios error so it can be under stood by the user
function getApiError(error) {
    if (error.response?.status === 429) {
        return {
            status: 429,
            message: "CoinGecko's rate limit has been reached. Please wait briefly and try again."
        };
    }

    if (error.response) {
        return {
            status: 502,
            message: "CoinGecko returned an error while loading the market data."
        };
    }

    if (error.request) {
        return {
            status: 503,
            message: "The market data service could not be reached. Check your connection and try again."
        };
    }

    return {
        status: 500,
        message: "An unexpected error occurred while loading the market data."
    };
}


app.get("/", async (req, res) => {
    //handle the token wanted by the user, 
    // if the token is not available, default back to bitcoin
    //remove all the spaces before and after the input 
    // and convert to lowercase to match coingecko id
    const selectedCoin = String(req.query.coin || "bitcoin").trim().toLowerCase();

    try{
        const response = await coingecko.get("/coins/markets", {
                //dynamic axios parameters
                params: {
                    vs_currency: "usd",
                    ids: selectedCoin,
                    sparkline: false
                }
        });
        //push the token gotten from api response into the first object in the array 
        // or return null if it is unavailable
        const coinData = response.data[0] || null;

        //is the token is not found, return null and error message for user
        if (!coinData) {
            return res.status(404).render("index.ejs", {
                data: null,
                selectedCoin,
                error: "No market data was found for that coin.",
                coins: coinList
            });
        }
        
        //if token is found, return the specific attributes of the token selected,
        //default error to null
        res.render("index.ejs", {
            data: coinData,
            selectedCoin,
            error: null,
            coins: coinList
        });
    }
    catch(error){
        //handle the error shown to the user is any of axios error come to pass
        console.error("Failed to fetch prices", error.message || error);
        const apiError = getApiError(error);

        res.status(apiError.status).render("index.ejs", {
            error: apiError.message,
            selectedCoin,
            data: null,
            coins: coinList
        });
    }
});

//wait for loadCoinlist and send error if the coinlist failed
async function start() {
    try {
        await loadCoinList();
    }
    catch (error) {
        console.error("Failed to load the coin list:", getApiError(error).message);
    }

    app.listen(port, () => {
        console.log(`Running server on ${port}`);
    });
}

start();
