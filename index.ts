const setupGlitchies = ()=> {
    const glitchies = document.querySelectorAll('*:not([glitchies\\:wrapper]) > [data-glitchies]') as NodeListOf<HTMLElement>

    const polygons = [
        "polygon(0 0%, 100% 0%, 100% 5%, 0 5%)",
        "polygon(0 15%, 100% 15%, 100% 15%, 0 15%)",
        "polygon(0 10%, 100% 10%, 100% 20%, 0 20%)",
        "polygon(0 1%, 100% 1%, 100% 2%, 0 2%)",
        "polygon(0 35%, 100% 35%, 100% 35%, 0 35%)",
        "polygon(0 45%, 100% 45%, 100% 46%, 0 46%)",
        "polygon(0 50%, 100% 50%, 100% 70%, 0 70%)",
        "polygon(0 70%, 100% 70%, 100% 70%, 0 70%)",
        "polygon(0 80%, 100% 80%, 100% 80%, 0 80%)",
        "polygon(0 50%, 100% 50%, 100% 55%, 0 55%)",
        "polygon(0 60%, 100% 60%, 100% 70%, 0 70%)"
    ]

    glitchies.forEach(el => {
        const options = el.dataset.glitchies ? JSON.parse(el.dataset.glitchies) : null

        const parent = el.parentElement as HTMLElement
        parent.setAttribute('glitchies:wrapper','')

        parent.style.position = 'relative'

        el.style.zIndex = '1'

        const cloneWrapper = document.createElement('div')
        cloneWrapper.setAttribute('glitchies:clone-wrapper','')
        cloneWrapper.style.position = 'absolute'
        cloneWrapper.style.inset = '0'
        cloneWrapper.style.zIndex = '2'
        cloneWrapper.style.overflow = 'hidden'

        for(let i = 0; i < 3; i++) { cloneWrapper.appendChild(el.cloneNode(true)) }

        const clones = Array.from(cloneWrapper.children) as Array<HTMLElement>
        clones.map((clone, index) => {
            clone.removeAttribute('data-glitchies')

            clone.style.position = 'absolute';
            clone.style.inset = '0';
            clone.style.transform = `translate${Math.round(Math.random()) === 0 ? 'X' : 'Y'}(${Math.round(Math.random() * 11) - 5}%)`;

            if(index === 0) {
                clone.animate([
                    { opacity: .2 },
                    { opacity: 0, offset: .3 },
                    { opacity: 0 }
                ], { duration: 1000, iterations: Infinity })

                return
            }

            clone.animate([0,1,2,3,4,5,6,7,8,9,10].map(()=> {
                return { clipPath: polygons[Math.round(Math.random() * (polygons.length + 1))] }
            }), { duration: (Math.round(Math.random() * 5) + 1) * 400, iterations: Infinity })
        });

        if(options && options.hover) {
            let element: HTMLElement | null = null;
            switch(options.hover) {
                case 'parent':
                    element = el.parentElement
                case 'self': 
                    element = el
            }

            if(element) {
                cloneWrapper.style.display = 'none'
                element.addEventListener('mouseenter', ()=> {
                    cloneWrapper.style.display = 'block'
                })
                element.parentElement?.addEventListener('mouseleave', ()=> {
                    cloneWrapper.style.display = 'none'
                })
            }

        }


        parent.appendChild(cloneWrapper)
        parent.appendChild(el)
    })
}

const setup = ()=> {
    window.addEventListener('load', ()=> {
        setupGlitchies()
    })
    window.addEventListener('reinitglitchies', ()=> {
        setupGlitchies()
    })
}

export {
    setup
}