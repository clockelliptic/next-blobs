importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

let data = {current:{}},
    _canvasHeight,
    _canvasWidth;
let forceSim;

self.onmessage = function(event) {
    switch (event.data.type) {
        case "init": return initForceSim(event.data);
        case "resize": return updateForceSim(event.data);
        case "exploded": return console.log("worker explode");
        case "end": return forceSim.stop();
    }
};

function initForceSim ({blobs, temperature, segmentRadius,
                        numGasParticles, gasParticleRadius,
                                canvasWidth, canvasHeight}) {
    data.current = graphemes(blobs, temperature, segmentRadius,
        numGasParticles, gasParticleRadius,
        canvasWidth, canvasHeight)();

    _canvasWidth = canvasWidth;
    _canvasHeight = canvasHeight;

    const { particles, links } = data.current;


    forceSim = d3.forceSimulation(particles)
        .alphaDecay(0)
        .velocityDecay(0)
        .force('bounce', forceBounce()
            .radius(d => d.r-1)
        )
        .force(
            'link', 
            d3.forceLink()
                .links(links)
                .distance(link => link.distance)
                .strength(link => link.strength)
                .id(link => link.id)
        )
        .force('container', forceSurface()
            .surfaces([
                {from: {x:0,y:0}, to: {x:0,y:_canvasHeight}},
                {from: {x:0,y:_canvasHeight}, to: {x:_canvasWidth,y:_canvasHeight}},
                {from: {x:_canvasWidth,y:_canvasHeight}, to: {x:_canvasWidth,y:0}},
                {from: {x:_canvasWidth,y:0}, to: {x:0,y:0}}
            ])
            .oneWay(true)
            .radius(d => d.r)
        )
        .on('tick', ticked('tick'));

        d3.timeout(function() {
            forceSim.stop()
            data.current.links = [];

            console.log("RESTARTING")
            ticked('explode')()
            
            forceSim.force("link").links([]);
            forceSim.alpha(1).restart();
        }, 6000);
        
        ticked('init')();
}

function updateForceSim (newData) {
    _canvasWidth = newData.canvasWidth*1.5;
    _canvasHeight = newData.canvasHeight*1.5;
    
    forceSim.force('container', forceSurface()
        .surfaces([
            {from: {x:0,y:0}, to: {x:0,y:_canvasHeight}},
            {from: {x:0,y:_canvasHeight}, to: {x:_canvasWidth,y:_canvasHeight}},
            {from: {x:_canvasWidth,y:_canvasHeight}, to: {x:_canvasWidth,y:0}},
            {from: {x:_canvasWidth,y:0}, to: {x:0,y:0}}
        ])
        .oneWay(true)
        .radius(d => d.r)
    )
}

function ticked (type='tick') {
    return function () {
        data.current.particles = forceSim.nodes()
        const blobs = [];
        const gas = [];
        data.current.particles.forEach(node => {
            let drawable = (node.hub===0 || node.hub);
            let isGas = node.type==='gas';
            if (drawable) {
                if (!blobs[node.hub]) {
                    blobs[node.hub] = [node]
                } else {
                    blobs[node.hub].push(node)
                }
            }
            if (isGas) {
                gas.push(node);
            }
        })
        postMessage({
            type, 
            data: {
                gas, 
                blobs,
                links: data.current.links
            },
        })
    }
}

/* **********************************************************

    COMMUNITY-SOURCED CUSTOM d3.JS FORCES

* ***********************************************************/

function constant (x) {
    return function() {
      return x;
    };
}

function forceBounce() {
    let nodes,
        elasticity = 1,                                 // 0 <= number <= 1
        radius = (node => 1),                           // accessor: number > 0
        mass = (node => Math.pow(radius(node), 2)),     // accessor: number > 0 (Mass proportional to area by default)
        onImpact;                                       // (node, node) callback

    function force() {

        const tree = d3.quadtree(nodes, d=>d.x, d=>d.y).visitAfter((quad) => {
            if (quad.data) return quad.r = radius(quad.data);
            for (let i = quad.r = 0; i < 4; ++i) {
                if (quad[i] && quad[i].r > quad.r) {
                    quad.r = quad[i].r; // Store largest radius per tree node
                }
            }
        });

        nodes.forEach(a => {
            const ra = radius(a);

            tree.visit((quad, x0, y0, x1, y1) => {

                const b = quad.data,
                    rb = quad.r,
                    minDistance = ra + rb;

                if (b) { // Leaf tree node
                    if (b.index > a.index) { // Prevent visiting same node pair more than once

                        if (a.x === b.x && a.y === b.y) {
                            // Totally overlap > jiggle b
                            const jiggleVect = polar2Cart(1e-6, Math.random() * 2 * Math.PI);
                            b.x += jiggleVect.x;
                            b.y += jiggleVect.y;
                        }

                        const impactVect = cart2Polar(b.x-a.x, b.y-a.y), // Impact vector from a > b
                            overlap = Math.max(0, minDistance - impactVect.d);

                        if (!overlap) return; // No collision

                        const vaRel = rotatePnt({x: a.vx, y: a.vy}, -impactVect.a), // x is the velocity along the impact line, y is tangential
                            vbRel = rotatePnt({x: b.vx, y: b.vy}, -impactVect.a);

                        // Transfer velocities along the direct line of impact (tangential remain the same)
                        ({ a: vaRel.x, b: vbRel.x } = getAfterImpactVelocities(mass(a), mass(b), vaRel.x, vbRel.x, elasticity));

                        // Convert back to original plane
                        ({ x: a.vx, y: a.vy } = rotatePnt(vaRel, impactVect.a));
                        ({ x: b.vx, y: b.vy } = rotatePnt(vbRel, impactVect.a));

                        // Split them apart
                        const nudge = polar2Cart(overlap, impactVect.a),
                            nudgeBias = ra/(ra+rb); // Weight of nudge to apply to B
                        a.x -= nudge.x * (1-nudgeBias); a.y -= nudge.y * (1-nudgeBias);
                        b.x += nudge.x * nudgeBias; b.y += nudge.y * nudgeBias;

                        onImpact && onImpact(a, b);
                    }
                    return;
                }

                // Only keep traversing sub-tree quadrants if radius overlaps
                return x0 > a.x + minDistance || x1 < a.x - minDistance || y0 > a.y + minDistance || y1 < a.y - minDistance;
            });
        });

        //

        function getAfterImpactVelocities(ma, mb, va, vb, elasticity = 1) {
            // Apply momentum conservation equation with coefficient of restitution (elasticity)
            return {
                a: (elasticity*mb*(vb-va) + ma*va + mb*vb) / (ma+mb),
                b: (elasticity*ma*(va-vb) + ma*va + mb*vb) / (ma+mb)
            }
        }

        function rotatePnt({x, y}, a) {
            const vect = cart2Polar(x, y);
            return polar2Cart(vect.d, vect.a + a);
        }

        function cart2Polar(x, y) {
            x = x||0; // Normalize -0 to 0 to avoid -Infinity issues in atan
            return {
                d: Math.sqrt(x*x + y*y),
                a: (x === 0 && y === 0) ? 0 : Math.atan(y/x) + (x<0 ? Math.PI : 0) // Add PI for coords in 2nd & 3rd quadrants
            }
        }

        function polar2Cart(d, a) {
            return {
                x: d * Math.cos(a),
                y: d * Math.sin(a)
            }
        }
    }

    function initialize() {}

    force.initialize = function(_) {
        nodes = _;
        initialize();
    };

    force.elasticity = function(_) {
        return arguments.length ? (elasticity = _, force) : elasticity;
    };

    force.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
    };

    force.mass = function(_) {
        return arguments.length ? (mass = typeof _ === "function" ? _ : constant(+_), force) : mass;
    };

    force.onImpact = function(_) {
        return arguments.length ? (onImpact = _, force) : onImpact;
    };

    return force;
}

function forceSurface() {
    let nodes,
        surfaces = [],
        elasticity = 1,                         // 0 <= number <= 1
        radius = (node => 1),                   // accessor: number > 0
        from = (surface => surface.from),       // accessor: { x, y }
        to = (surface => surface.to),           // accessor: { x, y }
        oneWay = (surface => !!surface.oneWay), // accessor: boolean
        onImpact;                               // (node, surface) callback

    function force() {
        nodes.forEach(node => {
            const nodeRadius = radius(node),
                velVect = cart2Polar(node.vx, node.vy),
                lineToFuture = {
                    from: {x: node.x, y: node.y},
                    to: {x: node.x + node.vx, y: node.y + node.vy}
                };

            surfaces.forEach(surface => {
                const surfLine = { from: from(surface), to: to(surface) },
                    surfVect = cart2Polar(surfLine.to.x - surfLine.from.x, surfLine.to.y - surfLine.from.y),
                    inReverse = normalizeAngle(surfVect.a - velVect.a) < Math.PI; // true if the node is travelling in a direction of S>N relative to the from(W)>to(E) axis

                if (inReverse && oneWay(surface)) return; // Don't collide in reverse direction

                const nodeLine = translateLn(
                        lineToFuture,
                        polar2Cart(nodeRadius, surfVect.a + Math.PI/2 * (inReverse?-1:1)) // node radius offset facing the surface
                    ),
                    nodeBisect = {
                        from: translatePnt(node, polar2Cart(nodeRadius, surfVect.a - Math.PI/2)),
                        to: translatePnt(node, polar2Cart(nodeRadius, surfVect.a + Math.PI/2))
                    },
                    overlaps = intersect(surfLine, nodeBisect); // Whether the node is already overlapping with the surface

                if (!overlaps && !intersect(surfLine, nodeLine)) return; // No collision

                const velRel = polar2Cart(velVect.d, velVect.a - surfVect.a); // x is the velocity parallel to the surface, y is perpendicular

                // Invert velocity and absorb shock (elasticity) along the surface perpendicular
                velRel.y *= -elasticity;

                // Convert back to original plane
                ({ x: node.vx, y: node.vy } = rotatePnt(velRel, surfVect.a));

                if (overlaps && !oneWay(surface)) {
                    // In two-way mode, need to move node out of the way to prevent trapping
                    const nudgeOffset = polar2Cart(
                        rotatePnt(translatePnt(nodeLine.from, { x: -surfLine.from.x, y: -surfLine.from.y }), - surfVect.a).y, // How much overlap along the surface perpendicular
                        surfVect.a - Math.PI/2   // Backwards from surface, along its perpendicular
                    );

                    node.x += nudgeOffset.x; node.y += nudgeOffset.y;
                }

                onImpact && onImpact(node, surface);
            });
        });

        //

        function intersect(la, lb) {
            return (turn(la.from, lb.from, lb.to) != turn(la.to, lb.from, lb.to))
                && (turn(la.from, la.to, lb.from) != turn(la.from, la.to, lb.to));

            function turn(p1, p2, p3) {
                const a = (p3.y - p1.y) * (p2.x - p1.x),
                    b = (p2.y - p1.y) * (p3.x - p1.x);
                return (a > b + Number.EPSILON) ? 1 : (a + Number.EPSILON < b) ? -1 : 0;
            }
        }

        function translatePnt({x, y}, {x: trX, y: trY}) {
            return { x: x + trX, y: y + trY };
        }

        function translateLn({from, to}, tr) {
            return { from: translatePnt(from, tr), to: translatePnt(to,tr) };
        }

        function rotatePnt({x, y}, a) {
            const vect = cart2Polar(x, y);
            return polar2Cart(vect.d, vect.a + a);
        }

        function cart2Polar(x, y) {
            x = x||0; // Normalize -0 to 0 to avoid -Infinity issues in atan
            return {
                d: Math.sqrt(x*x + y*y),
                a: (x === 0 && y === 0) ? 0 : Math.atan(y/x) + (x<0 ? Math.PI : 0) // Add PI for coords in 2nd & 3rd quadrants
            }
        }

        function polar2Cart(d, a) {
            return {
                x: d * Math.cos(a),
                y: d * Math.sin(a)
            }
        }

        function normalizeAngle(a) {
            const PI2 = Math.PI*2;
            while (a<0) a += PI2;
            while (a>PI2) a -= PI2;
            return a;
        }
    }

    function initialize() {}

    force.initialize = function(_) {
        nodes = _;
        initialize();
    };

    force.surfaces = function(_) {
        return arguments.length ? (surfaces = _, force) : surfaces;
    };

    force.elasticity = function(_) {
        return arguments.length ? (elasticity = _, force) : elasticity;
    };

    force.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
    };

    force.from = function(_) {
        return arguments.length ? (from = _, force) : from;
    };

    force.to = function(_) {
        return arguments.length ? (to = _, force) : to;
    };

    force.oneWay = function(_) {
        return arguments.length ? (oneWay = typeof _ === "function" ? _ : constant(!!_), force) : oneWay;
    };

    force.onImpact = function(_) {
        return arguments.length ? (onImpact = _, force) : onImpact;
    };

    return force;
}



/*

    DATA GENERATION UTILITIES

*/


function randomVelocity(temp) {
    // The Maxwell-Boltzman velocity distribution where temp is a renormalized temperature temp = kT/m
    return Math.random()*Math.sqrt(temp);
}

function graphemes(
        blobs, temp, segmentRadius,
        nGasParticles, gasParticleRadius,
        canvasWidth, canvasHeight ) {

    let hubs = blobs.map((blob, i) => {
        return {
            id: `hub-${i}`,
            x: (blob.position.x/100)*(canvasWidth),
            y: (blob.position.y/100)*(canvasWidth),
            //fx: 400*i,
            //fy: 400*i,
            vx: 0,
            vy: 0,
            r: segmentRadius,
            color: 'transparent'
        }
    });

    let segments = hubs.map((hub, i) =>{
        const blob = blobs[i]
        return new Array(blob.nSegments).fill().map((_, j) => {
            const angle = ((2*Math.PI)/blob.nSegments)*j;
            return {
                hub: i,
                id: `seg-${i}-${j}`,
                x: hub.x + 0.6*blob.radius*Math.cos(angle)+(((Math.random()>=0.5)?-1:1)*Math.random()*12),
                y: hub.y + 0.6*blob.radius*Math.sin(angle)+(((Math.random()>=0.5)?-1:1)*Math.random()*12),
                vx: 0,
                vy: 0,
                r: segmentRadius,
                color: blob.color
            }
        })
    });

    let wheels = segments.map((wheelset, i) => 
        /* 'wheels' are the d3.links that link outer blob segments together */
            wheelset.map((seg, j) => ({
                    source: seg.id,
                    target: wheelset[(i*wheelset.length+j+1)%wheelset.length].id,
                    distance: 2*blobs[i].radius*Math.sin(Math.PI/blobs[i].nSegments) * 0.5,
                    strength: 0.225,
                    color: seg.color
                })
            ));

    let hubspokes = hubs.map((hub, i) => 
        /* 'hubspokes' are the d3.links that connect the inner hub to the outer blob segments */
        segments[i].map((seg, j) => ({
            source: hub.id,
            target: seg.id,
            distance: blobs[i].radius,
            strength: 0.003
        }))
    );

    let gas = new Array(nGasParticles).fill().map((_, i) => {
        const a = (Math.random()>=0.5);
        return {
            type: 'gas',
            id: `gas-${i}`,
            x: (a)?0:canvasWidth,
            y: (a)?canvasHeight:0,
            vx: randomVelocity(temp),
            vy: randomVelocity(temp),
            r: gasParticleRadius,
            color: 'transparent'
        }
    });

    segments = segments.reduce((acc,x) => acc.concat(x),[])
    hubspokes = hubspokes.reduce((acc,x) => acc.concat(x),[]);

    const particles = hubs.concat(segments).concat(gas),
          links = wheels.reduce((acc,x) => acc.concat(x),[]).concat(hubspokes);
    
    return () => ({
        gas,
        particles,
        links,
        wheels
    });
}