const PORT = 8000;
const cheerio = require('cheerio')
const axios = require('axios')

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static(__dirname));
let odloty = 'https://poznanairport.pl/loty/przyloty-odloty/odloty/'
let przyloty = 'https://poznanairport.pl/loty/przyloty-odloty/przyloty/'


const fetchTime = async (adres_url) =>{
    let times = []
    try {
        let res = await axios.get(adres_url)
        let $ = await cheerio.load(res.data)
        let last_elemetn = $('.boardArchive__itemColumn.boardArchive__itemColumn--time > div').length -1;
        
            $('.boardArchive__itemColumn.boardArchive__itemColumn--time > div').each(function (i,e) {
                let time = $(e).text()
                time = time.replaceAll('/n','').replaceAll('Godzina','').trim()
                
                if(i === 0 || i === last_elemetn) return

                times.push(time)
            })
    
          

    } catch (error) {
        console.log(error);
    }

    return times;

}

const fetchKierunek = async (adres_url) =>{

    let directions = []

    try {
        let res = await axios.get(adres_url)
        let $ = await cheerio.load(res.data)
        let last_elemetn = $('li.boardArchive__itemColumn.boardArchive__itemColumn--destination').length - 1;
        
            $('li.boardArchive__itemColumn.boardArchive__itemColumn--destination').each(function (i,e) {

                let kierunek = $(e).text()
                kierunek = kierunek.trim()

                if(i === 0 || i === last_elemetn) return
                
                directions.push(kierunek)
            })
    


    } catch (error) {
        console.log(error);
    }

    return directions;      

}

const fetchFlightNumber = async (adres_url) =>{

    let numbers = []

    try {
        let res = await axios.get(adres_url)
        let $ = await cheerio.load(res.data)

        let last_elemetn = $('li.boardArchive__itemColumn.boardArchive__itemColumn--number > div').length -1;
        
        $('li.boardArchive__itemColumn.boardArchive__itemColumn--number > div').each(function (i,e) {
                let flight_number = $(e).text()
                flight_number = flight_number.trim()

                if(i === 0 || i === last_elemetn) return
                
                numbers.push(flight_number)
            })
    


    } catch (error) {
        console.log(error);
    }

    return numbers;      

}

const fetchFlighStatus = async (adres_url) =>{

    let statuses = []

    try {
        let res = await axios.get(adres_url)
        let $ = await cheerio.load(res.data)

        let last_elemetn = $('li.boardArchive__itemColumn.boardArchive__itemColumn--status > div').length -1;
        
        $('li.boardArchive__itemColumn.boardArchive__itemColumn--status > div').each(function (i,e) {
                let flight_status = $(e).text()
                flight_status = flight_status.replaceAll('Status\n','').trim().toUpperCase();

                if(i === 0 || i === last_elemetn) return
                
                statuses.push(flight_status)
            })
    


    } catch (error) {
        console.log(error);
    }

    return statuses;      

}


app.get('/przyloty', async (req, res) => {
    let dane = []
    let times = await fetchTime(przyloty);
    let directions = await fetchKierunek(przyloty);
    let numbers = await fetchFlightNumber(przyloty);
    let statuses = await fetchFlighStatus(przyloty)
    let ilosc_lotow = times.length;
    

    for(let i = 0; i < ilosc_lotow; i++){

        let url = 'https://www.flightradar24.com/data/flights/' + numbers[i].replaceAll(' ','').toLowerCase()

        let lot = {
            godzina: times[i],
            kierunek: directions[i],
            numer_lotu: numbers[i],
            stan: statuses[i],
            url: url
        }

        dane.push(lot)
    }


    res.send(dane)
})

app.get('/odloty', async (req, res) => {
    let dane = []
    let times = await fetchTime(odloty);
    let directions = await fetchKierunek(odloty);
    let numbers = await fetchFlightNumber(odloty);
    let statuses = await fetchFlighStatus(odloty)

    let ilosc_lotow = times.length;

    for(let i = 0; i < ilosc_lotow; i++){
        let url = 'https://www.flightradar24.com/data/flights/' + numbers[i].replaceAll(' ','').toLowerCase()

        let lot = {
            godzina: times[i],
            kierunek: directions[i],
            numer_lotu: numbers[i],
            stan: statuses[i],
            url: url
        }

        dane.push(lot)
    }




    res.send(dane)
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))