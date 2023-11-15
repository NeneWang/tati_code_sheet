
const SHEET_ID = '1iIH5JafHEYD3NusdedZcgGVby21wViVBAk_OyApeFX0';
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;

const SHEET_NAME = 'Remitos'

let query = encodeURIComponent('SELECT *');
const URL = BASE + `sheet=${SHEET_NAME}&headers=1&tq=${query}`;
document.addEventListener('DOMContentLoaded', function () {
    // console.log('DOM loaded')
    fetch(URL).then(res => res.text()).then(text => {
        // console.log(text)
        const jsData = JSON.parse(text.substr(47).slice(0, -2))
        // console.table(jsData['table']['rows'])
        jsData.table.cols.forEach((heading) => {
            if(heading.label){
                const propName = heading.label.toLowerCase();
                console.log(propName)
            }
        })
        console.log(jsData['table']['rows'])
        console.table(jsData['table']['cols'])
    })
});

