const container = document.getElementById("container")

const entities = []

const ENTITY_RADIOUS = 7
const DEMAGE_MAX = 100
const PREY_PERCENTAGE = 30
const ENTITES_COUNT = 40

class Entity {
    constructor ( x, y, demage, type ) {
        this.x = x
        this.y = y
        this.demage = demage
        this.type = type
    }
    draw ( ctx ) {
        ctx.beginPath()
        ctx.lineWidth = 2
        switch ( this.type ) {
            case "human": { ctx.strokeStyle = "#0000ff"; break }
            case "predator": { ctx.strokeStyle = "#ff0000"; break }
            default: ctx.strokeStyle = "black"
        }
        ctx.arc(this.x, this.y, this.highlight ? ENTITY_RADIOUS * 1.2 : ENTITY_RADIOUS, 0, 2 * Math.PI)
        ctx.stroke()
        // if (this.highlight) {
            // ctx.fillStyle = `${ctx.strokeStyle}${Math.round((10 / 100) * 255).toString(16)}`
            ctx.fillStyle = `${ctx.strokeStyle}${Math.round((this.demage / 100) * 255).toString(16).padStart(2,"0")}`
            ctx.arc(this.x, this.y, this.highlight ? ENTITY_RADIOUS * 1.2 : ENTITY_RADIOUS, 0, 2 * Math.PI)
            ctx.fill()
        // }
        ctx.closePath()
    }
}

class Simulation {
    constructor ( width, height, container ) {
        this.width = width
        this.height = height
        this.container = container
        this.canvas = document.createElement("canvas")
        
        this.isRun = false
        
        this.canvas.width = width
        this.canvas.height = height
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this))
        this.canvas.addEventListener("mouseenter", () => this.mousein = true)
        this.canvas.addEventListener("mouseout", () => this.mousein = false)
        
        this.ctx = this.canvas.getContext("2d")
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 16px Arial";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        
        this.container.appendChild(this.canvas)
        
        this.lastTime = Date.now()
        
        this.t = 0
        this.delta = 0
        this.mousein = false
        this.mouse = {
            x: 0,
            y: 0
        }
        
        this.resetEntities()
    }
    
    run () {
        this.isRun = true
        
        window.requestAnimationFrame(this.step.bind(this))
    }
    
    step () {
        this.isRun && window.requestAnimationFrame(this.step.bind(this))
        this.delta = ( Date.now() - this.lastTime ) / 1000
        this.clear(this.ctx)
        this.draw(this.ctx)
        this.update()
    }
    
    update () {
        this.t = this.t >= 1 ? 0 : this.t + this.delta
        this.lastTime = Date.now()
        
        this.entities.sort((a, b) => ((a.x-this.mouse.x)**2 + (a.y-this.mouse.y)**2) - ((b.x-this.mouse.x)**2 + (b.y-this.mouse.y)**2))
    }
    
    draw ( ctx ) {
        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.rect(0,0,this.width,this.height)
        ctx.stroke()
        ctx.closePath()
        
        // ctx.fillText(`${this.delta}`, 100, 100)
        this.entities.forEach( entity => {
            entity.draw(this.ctx)
        })
        
        // if (this.mousein) {
            // ctx.beginPath()
            // ctx.strokeStyle = "black"
            // ctx.lineWidth = 1
            // ctx.arc(this.mouse.x, this.mouse.y, ENTITY_RADIOUS, 0, 2 * Math.PI)
            // ctx.stroke()
            // ctx.closePath()
        // }
    }
    
    clear( ctx ) {
        ctx.clearRect(0,0,this.width,this.height)
        ctx.beginPath()
        ctx.closePath()
    }
    
    mouseMove (e) {
        const { x, y } = e
        const rect = this.canvas.getBoundingClientRect()
        this.mouse.x = x - rect.top
        this.mouse.y = y - rect.left
        
        this.entities.filter( entity => {
            entity.highlight = (entity.x-this.mouse.x)**2 + (entity.y-this.mouse.y)**2 <= ENTITY_RADIOUS**2
            return (entity.x-this.mouse.x)**2 + (entity.y-this.mouse.y)**2 <= ENTITY_RADIOUS**2
        })
        
    }
    
    resetEntities () {
        this.entities = []
        for (let i = 0; i < ENTITES_COUNT; i++) {
            const randoms = [...window.crypto.getRandomValues(new Uint8Array(4))].
map(s=>s/2**8)
            this.entities.push( new Entity(
                randoms[0] * this.width, 
                randoms[1] * this.height,
                randoms[2] * DEMAGE_MAX, 
                randoms[3] < PREY_PERCENTAGE/100 ? "human" : "predator"
            ) )
        }
    }
    
    newEntity () {
         
    }
    
}



function init() {
    const simul = new Simulation( 400, 400, container )
    
    document.getElementById("reset").addEventListener("click", simul.resetEntities.bind(simul))
    
    simul.run()
}

init()