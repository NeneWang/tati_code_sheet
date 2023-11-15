
const SHEET_ID = '1iIH5JafHEYD3NusdedZcgGVby21wViVBAk_OyApeFX0';
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;

const SHEET_NAME = 'Remitos'

let query = encodeURIComponent('SELECT *');
const URL = BASE + `sheet=${SHEET_NAME}&headers=1&tq=${query}`;

const output = document.querySelector('.output')

document.addEventListener('DOMContentLoaded', function () {
    const data = []
    const colz = []
    console.log('DOM loaded')
    fetch(URL).then(res => res.text()).then(text => {
        // console.log(text)
        const jsData = JSON.parse(text.substr(47).slice(0, -2))
        // console.table(jsData['table']['rows'])
        jsData.table.cols.forEach((heading) => {
            if (heading.label) {
                const propName = heading.label.toLowerCase();
                // console.log(propName`)
                colz.push(propName)
            }
        })
        console.log(jsData['table']['rows'])
        console.table(jsData['table']['cols'])
        jsData['table']['rows'].forEach((main) => {
            const row = {}
            main.c.forEach((cell, i) => {
                row[colz[i]] = cell ? cell.v : null
            })
            data.push(row)
        })
        console.table(data)
        maker(data);
    })
});

function maker(json){
    console.log('calling maker')
    const div = document.createElement('div')
    div.style.display = 'grid'
    div.style.gridTemplateColumns = 'repeat(10, 1fr)'
    output.append(div)
    let first = true
    json.forEach((el) => {
        
        const keys = Object.keys(el);
        
        if(first){
            keys.forEach((key) => {
                const ele = document.createElement('div')
                ele.textContent = key.toUpperCase();
                ele.style.fontWeight = 'bold'
                // ele.innerText = key
                div.append(ele)
            })
            first = false
        }


        keys.forEach((key) => {
            const span = document.createElement('span')
            span.innerText = el[key]
            div.append(span)
        })

        console.log(keys)
    })
}

