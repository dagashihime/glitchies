import { Options } from "./types"

const polygons = [
    "0 0%, 100% 0%, 100% 5%, 0 5%",
    "0 15%, 100% 15%, 100% 15%, 0 15%",
    "0 10%, 100% 10%, 100% 20%, 0 20%",
    "0 1%, 100% 1%, 100% 2%, 0 2%",
    "0 35%, 100% 35%, 100% 35%, 0 35%",
    "0 45%, 100% 45%, 100% 46%, 0 46%",
    "0 50%, 100% 50%, 100% 70%, 0 70%",
    "0 70%, 100% 70%, 100% 70%, 0 70%",
    "0 80%, 100% 80%, 100% 80%, 0 80%",
    "0 50%, 100% 50%, 100% 55%, 0 55%",
    "0 60%, 100% 60%, 100% 70%, 0 70%"
]

let defaults: Options = {
    axis: {
        x: true,
        y: true
    },
    hover: false,
    hoverInverse: false,
    totalClones: 3
}

const getAxis = ({ x, y }: { x: boolean, y: boolean })=> {
    let response;
    if(x && y) {
        response = Math.round(Math.random())
            ? 'X' 
            : 'Y'
    } else if(x) {
        response = 'X'
    } else if(y) {
        response = 'Y'
    } else {
        throw { "status": 500, "message": "Can't disable both x and y axis!" }
    }

    return response
}

const configureDefaults = (options: Options)=> {
    defaults = {...defaults, ...options}
    return defaults
}

const find = ()=> {
    return document.querySelectorAll('*:not([glitchies\\:wrapper]) > [data-glitchies]') as NodeListOf<HTMLElement>
}

const init = ({ nodeList }: { nodeList: NodeListOf<HTMLElement> })=> {
    nodeList.forEach(node => setup(node))
}

const setup = (node: HTMLElement)=> {
    const nodeOptions: Options = node.dataset.glitchies 
        ? JSON.parse(node.dataset.glitchies) 
        : {}
    const options: Options = {...defaults, ...nodeOptions}

    const parent = node.parentElement as HTMLElement
    parent.setAttribute('glitchies:wrapper','')
    parent.style.position = 'relative'

    node.style.zIndex = '1'

    const cloneWrapper = document.createElement('div')
    cloneWrapper.setAttribute('glitchies:clone-wrapper','')
    cloneWrapper.style.position = 'absolute'
    cloneWrapper.style.inset = '0'
    cloneWrapper.style.zIndex = '2'
    cloneWrapper.style.overflow = 'hidden'

    for(let i = 0; i < options.totalClones!; i++) { cloneWrapper.appendChild(node.cloneNode(true)) }

    const clones = Array.from(cloneWrapper.children) as Array<HTMLElement>
    clones.map((clone, index) => setupClone(clone, { index, options }));

    if(options && options.hover) {
        let element: HTMLElement | null = null;
        switch(options.hover) {
            case 'parent':
                element = parent
                break;
            case 'self': 
                element = node
                break;
        }

        if(element) {
            cloneWrapper.style.display = options.hoverInverse ? 'block' : 'none'
            element.addEventListener('mouseenter', ()=> {
                cloneWrapper.style.display = options.hoverInverse ? 'none' : 'block'
            })
            element.addEventListener('mouseleave', ()=> {
                cloneWrapper.style.display = options.hoverInverse ? 'block' : 'none'
            })
        }

    }

    parent.appendChild(cloneWrapper)
    parent.appendChild(node)
}

const setupClone = (clone: HTMLElement, { index, options }: { index: number, options: Options })=> {
    clone.removeAttribute('data-glitchies')

    clone.style.position = 'absolute';
    clone.style.inset = '0';

    const axis = getAxis(options.axis!)
    const percent = Math.round(Math.random() * 10) - 5
    clone.style.transform = `translate${axis}(${percent}%)`;

    if(index === 0) {
        clone.animate([
            { opacity: .2 },
            { opacity: 0, offset: .3 },
            { opacity: 0 }
        ], { duration: 1000, iterations: Infinity })

        return
    }

    clone.animate([0,1,2,3,4,5,6,7,8,9,10].map(()=> {
        const index = Math.round(Math.random() * (polygons.length - 1))

        return { clipPath: `polygon(${polygons[index]})` }
    }), { duration: (Math.round(Math.random() * 5) + 1) * 400, iterations: Infinity })
}

const listen = ()=> {
    window.addEventListener('load', ()=> {
        init({ nodeList: find() })
    })
    window.addEventListener('init:glitchies', ()=> {
        init({ nodeList: find() })
    })
}

export {
    configureDefaults,
    find,
    listen
}