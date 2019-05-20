'use strict';

class Grafico {
    constructor (altura=500, largura=500) {
        this.altura = altura
        this.largura = largura
        this.margemVertical = 50
        this.margemHorizontal = 50

        this.svg = this.criaSVG()
        
        this.scalaX = d3.scaleLinear()
            .domain([0, 100 /* this.largura - this.margemVertical*2 */])
            .range([this.margemVertical, this.largura - this.margemVertical])
        this.scalaY = d3.scaleLinear()
            .domain([this.altura - this.margemHorizontal*2, 0])
            .range([this.margemHorizontal, this.altura - this.margemHorizontal])

        
        this.criaMargens()
    }

    criaMargens() {
        let eixoX = d3.axisBottom().scale(this.scalaX)
        let eixoY = d3.axisLeft().scale(this.scalaY)

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.altura - this.margemVertical})`)
            .call(eixoX);
        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, 0)`)
            .call(eixoY);
    }

    criaSVG() {
        let div = d3.select('body').append('div')
        let svg = div.append('svg')
        svg.attr('height', this.altura)
            .attr('width', this.largura)
            .style('style', 'color: black');

        return svg
    }
}

let el = new Grafico(1000, 1000)

class Histograma extends Grafico {
    constructor() {
        super()        
    }
}

class ScatterPlot extends Grafico {
    constructor() {
        super(1000, 1000)
        console.log(this.largura)
    }

    criaPonto(x, y) {
        let pto = d3.select('circle')
            .attr('cx', this.largura + x)
            .attr('cy', this.altura - y)
            .attr('r', 10)
            .attr('stroke', 'black');
        return pto
    }

    preenche(pontos) {
        let tags = []
        for(let ponto of pontos) {
            this.svg.selectAll('circle').data(pontos).enter().append('circle')
                .attr('cx', (d) => {return this.scalaX(d.x)})
                .attr('cy', (d) => {return this.scalaY(d.y)})
                .attr('r', 2.5)
                .attr('stroke', 'black');
        }
        
    }
}

/* let scatter = new ScatterPlot()
let vetorPontos = [
    {x: 50, y:50},
    {x: 100, y:100}
]
scatter.preenche(vetorPontos) */

class Serie extends Grafico {
    constructor() {
        super()
    }
}