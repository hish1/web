
let opt = ['Название', 'Компания', 'Страна', 'Год', 'Язык', 'Количество видео'];
let c = ['', '', ''];
let sel = document.getElementsByTagName('select');
let f = s = t = 0;
let text2 = '';
let text1 = '';

let tab = [];
let k = [];

function build(){
    if (tab.length == 0){
        let element = document.getElementsByTagName('tbody')
        element = element[0].children;
        for (let i = 0; i < element.length; i++){
            let ch = element[i].children;
            if (i == 0)
                for (let j = 0; j < ch.length; j++)
                    k.push(ch[j].textContent);
            else {       
                let el = {};
                for (let j = 0; j < ch.length; j++)
                el[k[j]] = ch[j].textContent ;
                tab.push(el); 
            }
        }
    }

    let el = document.getElementsByClassName('graph');
    el = el[0].getElementsByTagName('input');

    let v = '';
    if (el[0].checked == true) v = el[0].value;
    else if (el[1].checked == true) v = el[1].value;
    else v = el[2].value;

    let arrGraph = getArrGraph(tab, v, "Количество видео");
    let marginX = 50;
    let marginY = 70;
    let height = 500;
    let width = 920;
   
    let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);
    svg.selectAll("*").remove();

    // определяем минимальное и максимальное значение по оси OY
    let min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
    let max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
   
    // определяем шкалы для осей
    let scaleX = d3.scaleBand()
    .domain(arrGraph.map(function(d) {return d.labelX;}))
    .range([0, xAxisLen],1);
    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([yAxisLen, 0]);

    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная
   
    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {return "rotate(-45)";});
   
    // отображаем ось OY
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);
   
     // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
    .append("line") // добавляем линию
    .classed("grid-line", true) // добавляем класс
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - (yAxisLen));
   
    // создаем горизонтальные линии сетки
    d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLen)
    .attr("y2", 0);

    let flag = true;
    // отображаем данные в виде точечной диаграммы
    if(el[3].checked == true){

        svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return scaleX(d.labelX); })
        .attr("cy", function(d) { return scaleY(d.valueMax); })
        .attr("transform",
        `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
        .style("fill", "red");
        
        flag = false;
    }
    if (el[4].checked == true){
        
        svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return scaleX(d.labelX); })
        .attr("cy", function(d) { return scaleY(d.valueMin); })
        .attr("transform",
        `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
        .style("fill", "blue");
        
        flag = false;
    }
    if (el[5].checked == true){
        
        svg.selectAll(".dot")
        .data(arrGraph)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return scaleX(d.labelX); })
        .attr("cy", function(d) { return scaleY(d.valueAvg); })
        .attr("transform",
        `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
        .style("fill", "green");
        
        flag = false;
    }
    if (flag){
        alert('error');
        svg.selectAll("*").remove();
    }

}
function getArrGraph(arrObject, fieldX, fieldY) {

    // сформируем список меток по оси OX (различные элементы поля fieldX)
    let i = k.indexOf(fieldX);
    let groupObj = d3.group(arrObject, d => d[k[i]]);

    arrGroup = []; 
    for(let entry of groupObj) {
        //выделяем минимальное и максимальное значения поля fieldY для очередной метки по оси ОХ
        let j = k.indexOf(fieldY);
        let minMax = d3.extent(entry[1].map(d => parseFloat(d[k[j]])));
        let avg = d3.mean(entry[1].map(d => parseFloat(d[k[j]])))

        let elementGroup = {};
        elementGroup.labelX = entry[0];
        elementGroup.valueMin = minMax[0];
        elementGroup.valueMax = minMax[1];
        elementGroup.valueAvg = Math.round(avg);
        
        arrGroup.push(elementGroup);
    }
    return arrGroup;
}
function res_gr(){
    d3.select("svg.svg")
    .selectAll("*")
    .remove();

}

function filtr(){
    let table = document.getElementsByTagName('tbody');
    let tr = table[0].innerHTML;
    if (text1 == '') text1 = tr;

    tr = tr.split('<tr>');
    tr.shift();
    let th = tr.shift();
    for (let i = 0; i < tr.length; i++)
        tr[i] = tr[i].split('</tr>')[0];

    let inp = document.getElementsByClassName('filter');
    inp = inp[0].getElementsByTagName('input');

    for (let i = 0; i < inp.length-2; i++){
        if (inp[i].value != '')
            tr = check(tr, inp[i].value, i);
    }

    
    for (let i = 0; i < inp.length-2; i++)
        inp[i].value = '';

    for (let i = 0; i < tr.length; i++)
        tr[i] += '</tr>';   

    tr = tr.join('<tr>');
    tr = '<tr>' + th + '<tr>' + tr;
    table[0].innerHTML = tr;
}
function check(tr, value, n){
    let res = [];
    let nn = n;
    for (let i = 0; i < tr.length; i++){
        let td =  tr[i].split('<td>');
        td.shift();

        n = nn;
        if (n!=4 && n!=5) {
            if (n == 3) 
                n = 4;
            let k = 0;
            let a = td[n].indexOf('</td>');
            let l = '';
            while(k < a){
                l+=td[n][k];
                k++;
            }

            if (n == 2 || n == 4){
                if (!(isNaN(parseFloat(l))) && isFinite(l))
                    break;
                else if (l == value)
                    res.push(tr[i]);
            }
            else 
                if (l == value)
                    res.push(tr[i]);
        }
        else{
            let k = 0;
            let a = td[3].indexOf('</td>');
            let l = '';
            while(k < a){
                l+=td[3][k];
                k++;
            }

            if (n == 4){
                if (!(isNaN(parseFloat(l))) && isFinite(l) && l >= value)
                    res.push(tr[i]);
            }
            else 
                if (!(isNaN(parseFloat(l))) && isFinite(l) && l <= value)
                    res.push(tr[i]);
        }
    }
    return res;
}
function res(){
    if (text1 != ''){
        let table = document.getElementsByTagName('tbody');
        table[0].innerHTML = text1;
    }
    let inp = document.getElementsByClassName('filter');
    inp = inp[0].getElementsByTagName('input');

    for (let i = 0; i < inp.length-2; i++)
        inp[i].value = '';
}

function change1(){
    changeOption(0);
}
function change2(){
    changeOption(1);
}
function change3(){
    changeOption(2);
}
function changeOption(id){
    if (sel[id].options[sel[id].selectedIndex].value == 0){
        for (let i = 0; i < 3; i++)
            if (i != id)
                back(sel[i], id);
        c[id] = '';
    }
    else {
        for (let i = 0; i < 3; i++)
            if (i != id){
                for (let j = 0; j < sel[i].options.length; j++){
                    if (sel[i].options[j].text== sel[id].options[sel[id].selectedIndex].text){
                        sel[i].options[j] = null;
                        break;
                    }
                }
                if (c[id] != '')
                    back(sel[i], id);
            }
        if (id == 0) c[0] = sel[id].options[sel[id].selectedIndex].text;
        else if (id == 1) c[1] = sel[id].options[sel[id].selectedIndex].text;
        else c[3] = sel[id].options[sel[id].selectedIndex].text;
    }
}
function back(elem, id){
    // let j = 1;
    // while (elem.options.length > 1)
    //     elem.options[j] = null;

    // elem.options.add(new Option(opt[0], 1));
    // for(let i = 1; i < opt.length; i++){
    //     let o = new Option(opt[i], i+1);;
    //     elem.options.add(o);
    // }

    if (id == 0) elem.options.add(new Option(c[0], elem.options.length));
    else if (id == 1)  elem.options.add(new Option(c[1], elem.options.length));
    else elem.options.add(new Option(c[2], elem.options.length));
}

function reset(){
    if (text2 != ''){
        let t = document.getElementsByTagName('tbody');
        t[0].innerHTML = text2;

        for (let k = 0; k < 3; k++){
            let j = 1;
            while (sel[k].options.length > 1)
            sel[k].options[j] = null;

            sel[k].options.add(new Option(opt[0], 1));
            for(let i = 1; i < opt.length; i++){
                let o = new Option(opt[i], i+1);;
                sel[k].options.add(o);
            }
        }
        let b = document.getElementsByTagName('input');
        let but = [];
        for (let k = 0; k < b.length; k++)
            if (b[k].name == 'descSecond' || b[k].name == 'descFirst' || b[k].name == 'descThird')
                but.push(b[k]);
        
                for (let k = 0; k < 3; k++)
                but[k].checked = false;
    }
    else{
        for (let k = 0; k < 3; k++){
            let j = 1;
            while (sel[k].options.length > 1)
            sel[k].options[j] = null;

            sel[k].options.add(new Option(opt[0], 1));
            for(let i = 1; i < opt.length; i++){
                let o = new Option(opt[i], i+1);;
                sel[k].options.add(o);
            }
        }
        let b = document.getElementsByTagName('input');
        let but = [];
        for (let k = 0; k < b.length; k++)
            if (b[k].name == 'descSecond' || b[k].name == 'descFirst' || b[k].name == 'descThird')
                but.push(b[k]);
        
        for (let k = 0; k < 3; k++)
            but[k].checked = false;
    }
}
function sort(){
    let table = document.getElementsByTagName('tbody');
    let tr = table[0].innerHTML;
    if (text2 == '') text2 = tr;

    tr = tr.split('<tr>');
    tr.shift();
    let th = tr.shift();
    for (let i = 0; i < tr.length; i++)
        tr[i] = tr[i].split('</tr>')[0];
    
    cocktail(tr);
        
    for (let i = 0; i < tr.length; i++)
        tr[i] += '</tr>';   

    tr = tr.join('<tr>');
    tr = '<tr>' + th + '<tr>' + tr;
    table[0].innerHTML = tr;
}
function cocktail(tr) {

    let r = tr.length - 1;
    let l = 0; 

    f = opt.indexOf(sel[0].options[sel[0].selectedIndex].text);
    s = opt.indexOf(sel[1].options[sel[1].selectedIndex].text);
    t = opt.indexOf(sel[2].options[sel[2].selectedIndex].text);

    let flag = true;

    while (l < r) { 
        for (let i = l; i < r; i++) { 
            
            let td1 =  tr[i].split('<td>');
            td1.shift();
            let td2 =  tr[i+1].split('<td>');
            td2.shift();

            let next = sel[0].nextElementSibling;
            next = next.nextElementSibling;
            if (next.checked == true) flag = false;
            else flag = true;

            if (f>=0 && compB(td1, td2, f, flag)) 
                [tr[i], tr[i+1]] = [tr[i+1], tr[i]];

            else if (f>=0 && comp(td1, td2, f, flag))  {
                next = sel[1].nextElementSibling;
                next = next.nextElementSibling;
                if (next.checked == true) flag = false; 
                else flag = true;

                if (s>=0 && compB(td1, td2, s, flag)) 
                    [tr[i], tr[i+1]] = [tr[i+1], tr[i]];

                else if (s>=0 && comp(td1, td2, s, flag)) {
                    let next = sel[2].nextElementSibling;
                    next = next.nextElementSibling;
                    if (next.checked == true) flag = false;
                    else flag = true;

                    if (t>=0 && compB(td1, td2, t, flag))
                        [tr[i], tr[i+1]] = [tr[i+1], tr[i]];
                }
            } 
        } 
        l++; 

        for (let i = r; i >= l; i--) { 
            let td1 =  tr[i].split('<td>');
            td1.shift();
            let td2 =  tr[i-1].split('<td>');
            td2.shift();

            let next = sel[0].nextElementSibling;
            next = next.nextElementSibling;
            if (next.checked == true) flag = false;
            else flag = true;

            if (f>=0 && compB(td2, td1, f, flag)) 
                [tr[i], tr[i-1]] = [tr[i-1], tr[i]];

            else if (f>=0 && comp(td2, td1, f, flag)) { 
                next = sel[1].nextElementSibling;
                next = next.nextElementSibling;
                if (next.checked == true) flag = false; 
                else flag = true;

                if (s>=0 && compB(td2, td1, s, flag)) 
                    [tr[i], tr[i-1]] = [tr[i-1], tr[i]]; 

                else if (s>=0 && comp(td2, td1, s, flag)) {
                    let next = sel[2].nextElementSibling;
                    next = next.nextElementSibling;
                    if (next.checked == true) flag = false;
                    else flag = true;

                    if (t>=0 && compB(td2, td1, t, flag)) 
                        [tr[i], tr[i-1]] = [tr[i-1], tr[i]];
                }
            } 
        } 
        r--; 
    } 
} 
function compB(td1, td2, param, flag){
            let j = 0;
            let a = td1[param].indexOf('</td>');
            let l1 = '';
            while(j < a){
                l1+=td1[param][j];
                j++;
            }

            j = 0;
            a = td2[param].indexOf('</td>');
            let l2 = '';
            while(j < a){
                l2+=td2[param][j];
                j++;
            }

            if(isNaN(parseFloat(l1)) && !isFinite(l1)) 
                if (flag)
                    if (l1 > l2) return true;
                    else return false;
                else 
                    if (l1 < l2) return true;
                    else return false;
            else{
                l1 = parseFloat(l1);
                l2 = parseFloat(l2);
                if (flag)
                        if (l1 > l2) return true;
                        else return false;
                    else 
                        if (l1 < l2) return true;
                        else return false;
            }
}
function comp(td1, td2, param, flag){
    let j = 0;
    let a = td1[param].indexOf('</td>');
    let l1 = '';
    while(j < a){
        l1+=td1[param][j];
        j++;
    }

    j = 0;
    a = td2[param].indexOf('</td>');
    let l2 = '';
    while(j < a){
        l2+=td2[param][j];
        j++;
    }

    if(isNaN(parseFloat(l1)) && !isFinite(l1)) 
        if (l1 == l2) return true;
        else return false;
    else{
        l1 = parseFloat(l1);
        l2 = parseFloat(l2);
            if (l1 == l2) return true;
            else return false;
    }
}
