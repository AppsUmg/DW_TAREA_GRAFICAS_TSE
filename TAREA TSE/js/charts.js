let Partidos;
let x_Partidos;
let Color_Partidos;
let Porcentaje_Partidos;
let Participacion;

var myChart2;
var myChart;


$(document).ready(function () {
   // getVotos(0,0,1);
});

function BuscarVotos(){
var DEPARTAMENTO = document.getElementById("select1");
var D = DEPARTAMENTO.value;
console.log(D)


var MUNICIPIO = document.getElementById("select2");
var M= MUNICIPIO.value;
console.log(M)

var TIPO = document.getElementById("select3");
var T= TIPO.value;
console.log(T)

if(D != "DEPARTAMENTO"){
    if(M != "MUNICIPIO"){
        if(T != "TIPO DE ELECCION"){
            getVotos(D,M,T);
        }
    }
}

}

function RemoverCaracteres(data) {
    // var data1 = data.replace(/\\"/g, "");
    var data2 = data.replace("\/", "");
    return data2;

}
async function getVotos(d,m,te) {

    let response = await fetch('https://votosgt.azurewebsites.net/api/votos?d='+d+'&m='+m+'&te='+te)
        .then(response => response.json())
        .then(data => {
            const obj = JSON.parse(data);
            var total = obj.TOTALACTA.replace(",", "");
            console.log("total: " + total.replace(",", ""));

            //console.log(obj.VOTOS[0].S)
            console.log(obj)
            Partidos = [];
            x_Partidos = [];
            Color_Partidos = [];
            Porcentaje_Partidos = [];
            Participacion = [obj.PARTICIPACION[0].V, obj.PARTICIPACION[1].V]
            for (let index = 0; index < obj.VOTOS.length; index++) {
                Partidos[index] = obj.VOTOS[index].S;
                x_Partidos[index] = obj.VOTOS[index].V;
                Color_Partidos[index] = obj.VOTOS[index].C
                Porcentaje_Partidos[index] = parseFloat((parseInt(obj.VOTOS[index].V) * 100 / parseInt(total.replace(",", "")))).toFixed(2);

            }
            // console.log(Color_Partidos);
            ChartVotosPorOrganizacionPolitica(Partidos, x_Partidos, Color_Partidos);
            ChartDoughnutParticipacion(Participacion);
            loadTable(Partidos, x_Partidos, Porcentaje_Partidos);
            document.getElementById('Participacion').innerHTML = "Participacion: " + obj.TOTALVOTOS;
            document.getElementById('Abstencionismo').innerHTML = "Abstencionismo: " + obj.ABSTENCIONISMO;
            document.getElementById('Votantes-inscritos').innerHTML = "Votantes inscritos: " + obj.CNTVOTANTES;

            document.getElementById('MesasProcesadasPorcentaje').innerHTML = "Porcentaje De Mesas Procesadas: " + obj.PMESASPRO + "%";
            document.getElementById('MesasNoProcesadas').innerHTML = "Mesas no procesadas: " + obj.MESASFALT;
            document.getElementById('MesasProcesadas').innerHTML = "Mesas procesadas: " + obj.MESASPRO;
            document.getElementById('TotalMesas').innerHTML = "Mesas procesadas: " + obj.CNTMESAS;

            document.getElementById('Tipo').innerHTML = obj.NTE;
            document.getElementById('MuniDepa').innerHTML = obj.NMUN + "," + obj.NDEP;
            document.getElementById('FechaHora').innerHTML = obj.FECHAHORA;
        });
}

function loadTable(N, V, P) {
    var H = "<tbody>";
    for (let index = 0; index < N.length; index++) {
        H += "<tr>";
        H += "<td>" + N[index] + "</td>";
        H += "<td>" + V[index] + "</td>";
        H += "<td>" + P[index] + "</td>";
        H += "</tr>";
    }
    H += "</tbody>";
    //console.log(H)
    document.getElementById("TResultados").innerHTML += H;
    //$("TResultados").html(H);
}


function ChartDoughnutParticipacion(info) {
    const data = {
        labels: [
            'ABSTENCIONISMO',
            'PARTICIPACION'
        ],
        datasets: [{
            label: 'PARTICIPACION',
            data: info,
            backgroundColor: ['#BBDEFB', '#1565C0'],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
    };


    if (myChart2 != null) {
        myChart2.destroy();
    }

        myChart2 = new Chart(
            document.getElementById('myChart2'),
            config
        );

}

function ChartVotosPorOrganizacionPolitica(Partidos, x, c) {

    const labels = Partidos;
    const data = {
        labels: labels,
        datasets: [{
            axis: 'y',
            label: 'Votos por Organización Política',
            data: x,
            fill: false,
            backgroundColor: c,
            borderColor: c,
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',
        }
    };


    if (myChart != null) {
        myChart.destroy();
    }

        myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    
    
   
}

function cambiaForm2(seleccion) {
    var sel1 = ["NIVEL NACIONAL"];
    var sel2 = ["NIVEL DEPARTAMENTAL","GUASTATOYA", "MORAZAN", "SAN AGUSTÍN ACASAGUASTLÁN", "SAN CRISTÓBAL ACASAGUASTLÁN", "EL JÍCARO", "SANSARE", "SANARATE", "SAN ANTONIO LA PAZ"];

    var select2 = document.getElementById("select2");

    select2.innerHTML = "";

    switch (seleccion) {
        case "0":
            for (i in sel1) {
                var opcion = document.createElement("option");
                opcion.value = ""+i;
                var texto = document.createTextNode(sel1[i]);
                opcion.appendChild(texto);
                select2.appendChild(opcion);
            }

            break;

        case "4":
            for (i in sel2) {
                var opcion = document.createElement("option");
                opcion.value = ""+i;
                var texto = document.createTextNode(sel2[i]);
                opcion.appendChild(texto);
                select2.appendChild(opcion);
            }

        case "DEPARTAMENTO":
            var opcion = document.createElement("option");
            var texto = document.createTextNode("MUNICIPIO");
            opcion.appendChild(texto);
            select2.appendChild(opcion);
            break;
    }
}
