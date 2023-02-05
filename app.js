let tableBody = document.getElementById('table-body')
const buttonKategoria = document.getElementById('kategoria')
let loader = document.getElementsByClassName('loader-holder')[0]


const getFlight = async () => {
    let kategoria = document.getElementsByTagName('h1')[1].innerText;
    let url = ''
    if(kategoria === 'Odloty'){
        url = 'http://localhost:8000/odloty'
    }
    else{
        url = 'http://localhost:8000/przyloty'
    }


    fetch(url)
        .then(response => response.json())
        .then(flights => {
            populateTable(flights)
        })
        .catch(err => console.log(err))
}
getFlight()

const populateTable = (flights) => {
    for (const flight of flights) {
        const tableRow = document.createElement('tr')
        const tableIcon = document.createElement('td')
        tableIcon.textContent = "✈"
        tableRow.append(tableIcon)

        const flightDetails = {
            time: flight.godzina,
            destination: flight.kierunek,
            flight: flight.numer_lotu,
            gate: flight.stan,
            //remarks: flight.url
        }

        for (const flightDetail in flightDetails) {
            const tableCell = document.createElement('td')
            const word = Array.from(flightDetails[flightDetail])
            for (const [index, letter] of word.entries()) {
                const letterElement = document.createElement('div')

                setTimeout(() => {
                    letterElement.classList.add('flip')
                    letterElement.textContent = letter
                    tableCell.append(letterElement)
                }, 100 * index)
            }
            tableRow.append(tableCell)
        }
        
        tableBody.append(tableRow)
        loader.style.display = 'none'
    }

}


buttonKategoria.addEventListener("click", function() {
    let buttonValue = document.getElementsByTagName('h1')[1].innerText;
    switch (buttonValue) {
        case 'Przyloty':
            document.getElementsByTagName('h1')[1].innerText = 'Odloty'
            document.getElementById('kategoria').innerText = 'Sprawdź przyloty'
            loader.style.display = 'flex'

            break;
        case 'Odloty':
            document.getElementsByTagName('h1')[1].innerText = 'Przyloty'
            document.getElementById('kategoria').innerText = 'Sprawdź odloty'
            loader.style.display = 'flex'

            break;
        default:
            break;
    }
    var newBody = document.createElement('tbody');
    tableBody.parentNode.replaceChild(newBody, tableBody)
    newBody.setAttribute('id', 'table-body')
    tableBody = document.getElementById('table-body')

    setTimeout(function(){
        getFlight()
    }, 2000);
   

    

    
});