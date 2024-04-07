const surfacesFS = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_camPos;
uniform vec3 u_camTar;
uniform mat3 u_camMat;
uniform float u_zoom;
uniform vec3 u_originOffset;
uniform int u_projectionID;
uniform float u_angleScale;

//#USER_VARS_IN#


out vec4 colour;

#define LIGHTING 0
#define BACKGROUND 3
#define LIMITX 3.
#define LIMITY 3.
#define LIMITZ 3.

#define ifloat vec2
#define ivec3 mat3x2
#define SMALL .0001
#define LARGE 999999.

#define CAM_DEPTH 30.
#define FOCAL_LENGTH 1.5


#define CONST_PI 3.1415926535
#define CONST_E 2.7182818284

#define LN_MIN -50.
#define REC_MAX 10000.

#define SEED_COUNT 1

//#COL_IN#


ifloat ord_ifloat(ifloat a) {
    return ifloat(min(a.s, a.t), max(a.s, a.t));
}

ivec3 ivec3_new(ifloat x, ifloat y, ifloat z) {
	return ivec3(x, y, z);
}

ivec3 ivec3_new(float x, float y, float z) {
	return ivec3(x, x, y, y, z, z);
}

ivec3 ivec3_new(vec3 p) {
	return ivec3(p.xx, p.yy, p.zz);
}

ivec3 ivec3_new(vec3 s, vec3 t) {
	return ivec3(s.x, t.x, s.y, t.y, s.z, t.z);
}

ivec3 ivec3_new(ivec3 a) {
    return ivec3(a[0].s, a[0].t, a[1].s, a[1].t, a[2].s, a[2].t);
}

// produces an interval vec3 with correct min/max properties
// (i.e. in order)
ivec3 ivec3_new_ord(vec3 a, vec3 b) { 
    return ivec3(
        min(a.x, b.x),
        max(a.x, b.x),
        min(a.y, b.y),
        max(a.y, b.y),
        min(a.z, b.z),
        max(a.z, b.z)
        );
}

// orders an interval vec3
ivec3 ord_ivec3(ivec3 a) { 
    return ivec3(
        min(a[0].s, a[0].t),
        max(a[0].s, a[0].t),
        min(a[1].s, a[1].t),
        max(a[1].s, a[1].t),
        min(a[2].s, a[2].t),
        max(a[2].s, a[2].t)
        );
}

ifloat imin(ifloat a, ifloat b) {
	return ifloat(min(a.s, b.s), min(a.t, b.t));
}
ifloat imin(ifloat a, float b) {
	return ifloat(min(a.s, b), min(a.t, b));
}
ifloat imin(float a, ifloat b) {
	return imin(b, a);
}

ifloat imax(ifloat a, ifloat b) {
	return ifloat(max(a.s, b.s), max(a.t, b.t));
}
ifloat imax(ifloat a, float b) {
	return ifloat(max(a.s, b), max(a.t, b));
}
ifloat imax(float a, ifloat b) {
	return imin(b, a);
}


ifloat iflr(ifloat a) {
    return ifloat(floor(a.s), floor(a.t));
}
ifloat iflr(float a) {
    return ifloat(floor(a));
}

ifloat icel(ifloat a) {
    return ifloat(ceil(a.s), ceil(a.t));
}
ifloat icel(float a) {
    return ifloat(ceil(a));
}


ifloat iabs(ifloat a) {
    return ifloat(
        abs(max(a.s, min(a.t, 0.))),
        max(abs(a.s), abs(a.t))
        );
}


ifloat iadd(ifloat a, ifloat b) {
	return a + b;
}
ifloat iadd(float a, ifloat b) {
    return iadd(ifloat(a), b);
}
ifloat iadd(ifloat a, float b) {
    return iadd(a, ifloat(b));
}

ivec3 iadd(ivec3 a, ivec3 b) {
	return ivec3_new(
		a[0].st + b[0].st,
		a[1].st + b[1].st,
		a[2].st + b[2].st);
}

ivec3 iadd(vec3 a, ivec3 b) {
	return ivec3_new(
		a.xx + b[0].st,
		a.yy + b[1].st,
		a.zz + b[2].st);
}


ifloat isub(ifloat a, ifloat b) {
	return a - b.ts;
}
ifloat isub(ifloat a, float b) {
	return isub(a, ifloat(b));
}
ifloat isub(float a, ifloat b) {
	return isub(ifloat(a), b);
}
ifloat isub(float a, float b) {
	return ifloat(a-b);
}

ivec3 isub(ivec3 a, ivec3 b) {
	return ivec3_new(
		a[0].st - b[0].ts,
		a[1].st - b[1].ts,
		a[2].st - b[2].ts);
}

ivec3 isub(ivec3 a, vec3 b) {
	return ivec3_new(
		a[0].st - b.xx,
		a[1].st - b.yy,
		a[2].st - b.zz);
}

ifloat imul(ifloat a, ifloat b) {
	vec4 c = vec4(a.sstt * b.stst); // find every combination of a.s * b.s, a.s * b.t etc
	return ifloat( // return the smallest and largest
		min(min(c[0], c[1]), min(c[2], c[3])),
		max(max(c[0], c[1]), max(c[2], c[3])));
}

ifloat imul(float a, ifloat b) {
	ifloat f = ifloat(a * b);
	return ifloat(
		min(f.s, f.t),
		max(f.s, f.t));
}
ifloat imul(ifloat a, float b) {
	ifloat f = ifloat(a * b);
	return ifloat(
		min(f.s, f.t),
		max(f.s, f.t));
}

ifloat imul(float a, float b) {
    return ifloat(a * b);
}

ivec3 imul(ivec3 a, ivec3 b) {
	return ivec3_new(
		imul(a[0].st, b[0].st),
		imul(a[1].st, b[1].st),
		imul(a[2].st, b[2].st)
	);
}

ivec3 imul(float a, ivec3 b) {
	return ivec3_new(
		imul(a, b[0].st),
		imul(a, b[1].st),
		imul(a, b[2].st)
	);
}

ivec3 imul(vec3 a, ivec3 b) {
	return ivec3_new(
		imul(a.xx, b[0].st),
		imul(a.yy, b[1].st),
		imul(a.zz, b[2].st)
	);
}

ivec3 imul(vec3 a, ifloat b) {
	return ivec3_new(
		imul(a.x, b),
		imul(a.y, b),
		imul(a.z, b)
	);
}


ifloat irec(ifloat a, int seed) {
    // seed is either -1 or 1, referring to the negative half or the positive half of the reciprical graph

    const float inputMin = 1. / REC_MAX;
    float lower = max(a.s * float(seed), inputMin);
    float upper = max(a.t * float(seed), inputMin);
    
    return float(seed) * ifloat(1. / upper, 1. / lower);

    // if (seed == -1) {
    //     float lower = min(a.s, -inputMin);
    //     float upper = min(a.t, -inputMin);
    //     return ifloat(1. / upper, 1. / lower);
    // } else {
    //     float lower = max(a.s, inputMin);
    //     float upper = max(a.t, inputMin);
    //     return ifloat(1. / upper, 1. / lower);
    // }
}
ifloat irec(float a, int seed) {
    return ifloat(1. / a);
}


ifloat ipow2(ifloat a) {
    ifloat m = iabs(a);
    return ifloat(m.s * m.s, m.t * m.t);
}

ivec3 ipow2(ivec3 v) {
	return ivec3_new(
		ipow2(v[0].st),
		ipow2(v[1].st),
		ipow2(v[2].st));
}

ifloat ilensq(ivec3 a) {
	ivec3 c = ipow2(a);
	return c[0].st + c[1].st + c[2].st;
}


ifloat ipow(ifloat a, float b) {
    ifloat c = pow(a, ifloat(b));
    return ifloat(min(c.s, c.t), max(c.s, c.t));
    //return ifloat(pow(a.s, b), pow(a.t, b));
}

ifloat iexp(float a) {
    return ifloat(exp(a));
}
ifloat iexp(ifloat a) {
    return ifloat(exp(a.s), exp(a.t));
}

ifloat iln(float a) {
    return ifloat(log(a));
}
ifloat iln(ifloat a) {
    // ifloat m = iabs(a);
    // return ifloat(log(m.s), log(m.t));
    const float inputMin = exp(LN_MIN);
    
    float lower = max(a.s, inputMin);
    float upper = max(a.t, inputMin);

    return ifloat(log(lower), log(upper));
}
ifloat iAbsLn(ifloat a) {
    ifloat absol = iabs(a);
    return ifloat(log(absol.s), log(absol.t));
}


bool icontains(ifloat a, float b) {
	return b >= a.s && b < a.t;
}

ifloat icos(float a) {
    return ifloat(cos(a));
}

ifloat isin(float a) {
    return ifloat(sin(a));
}

ifloat icos2(ifloat a) {
    ifloat section = floor(a / CONST_PI);
    ifloat cosed = cos(a);
    if (abs(section.s - section.t) < SMALL) { 
        // upper and lower are in the same section
        return ifloat(min(cosed.s, cosed.t), max(cosed.s, cosed.t));
    } else if (abs(section.s - section.t) - 1. < SMALL) {
        // adjacent sections
        if (mod(section.s, 2.) > mod(section.t, 2.)) {
            // lower is in an increasing section, and upper is in the next section (decreasing)
            return ifloat(min(cosed.s, cosed.t), 1.);
        } else {
            // lower is in a decreasing section
            return ifloat(-1., max(cosed.s, cosed.t));
        }
    } else {
        // non adjacent sections
        return ifloat(-1., 1.);
    }
}
ifloat isin2(ifloat a) {
    ifloat section = floor(a / CONST_PI - ifloat(1./2.));
    ifloat sined = sin(a);
    if (abs(section.s - section.t) < SMALL) { 
        // upper and lower are in the same section
        return ifloat(min(sined.s, sined.t), max(sined.s, sined.t));
    } else if (abs(section.s - section.t) - 1. < SMALL) {
        // adjacent sections
        if (mod(section.s, 2.) > mod(section.t, 2.)) {
            // lower is in an increasing section, and upper is in the next section (decreasing)
            return ifloat(min(sined.s, sined.t), 1.);
        } else {
            // lower is in a decreasing section
            return ifloat(-1., max(sined.s, sined.t));
        }
    } else {
        // non adjacent sections
        return ifloat(-1., 1.);
    }
}

ifloat icos(ifloat a) {
    return icos2(a * u_angleScale);
}
ifloat isin(ifloat a) {
    return isin2(a * u_angleScale);
}


// this function may be faster using pow() and conversion to int?
int intPow(int base, int exponent) {
    int r = 1;
    for (int i = 0; i < exponent; i++)
        r *= base;
    return r;
}

int getSeedPart(int seed, int part) {
    // for each segment, the seed range is iterated over
    // each seed part is -1 or 1

    // if seed = 5
    // seed part 0 =  1
    // seed part 1 = -1
    // seed part 2 =  1

    // essentially the problem is finding the "part"th digit when converting "seed" to binary

    int val = int(float(seed) / pow(2., float(part)));//intPow(2, part)
    float digit = min(1., mod(float(val), 2.));
    return int(digit) * 2 - 1; 
}


ifloat map2(ivec3 p, int seed) {
    //#EQ_IN#

    //return ifloat(-1., 1.);  
}

ifloat map(ivec3 p, int seed) {
    ivec3 offsetP = isub(p, u_originOffset);
    ivec3 scaledP = imul(vec3(u_zoom, u_zoom, u_zoom), offsetP);

    return map2(scaledP, seed);
}


// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
// https://www.shadertoy.com/view/wdXGDr
vec3 calcNormal(vec3 pos, int seed)
{
    vec2 e = vec2(1.0,-1.0);
    float eps = 0.005 * u_zoom;
    return normalize( e.xyy * map(ivec3_new(pos + e.xyy*eps), seed).s +
					  e.yyx * map(ivec3_new(pos + e.yyx*eps), seed).s +
					  e.yxy * map(ivec3_new(pos + e.yxy*eps), seed).s +
					  e.xxx * map(ivec3_new(pos + e.xxx*eps), seed).s );
}   

bool inLimits(ivec3 p, vec3 l) {
    return p[0].s < l.x && p[1].s < l.y && p[2].s < l.z
    && p[0].t > -l.x && p[1].t > -l.y && p[2].t > -l.z;
}
bool inLimits(ivec3 p) {
    return inLimits(p, vec3(LIMITX, LIMITY, LIMITZ));
}


struct raySolution {
    bool success;
    int seed;
    vec3 pos;
};
raySolution findRaySolution(vec3 rayOrigin, vec3 rayDir) {    
	const float solutionAcceptThreshold = 1e-3;

    vec3 segMin = rayOrigin;
    vec3 segHalf = vec3(0.);
    vec3 segMax = rayOrigin + CAM_DEPTH*rayDir;

    bool solutionAccept = false;
    int finalSeed = -1;
    for (int i = 0; i < 300; i++) {
        segHalf = 0.5 * (segMin + segMax);

        // the bisected interval segments to be tested
        ivec3 segs[2] = ivec3[2](
            ivec3_new(segMin, segHalf),
            ivec3_new(segHalf, segMax)
        );

        bool foundSolution = false;
        for (int seg = 0; seg < segs.length() && !foundSolution; seg++) {
            for (int seed = 0; seed < SEED_COUNT && !foundSolution; seed++) {
                ifloat functionOutput = map(
                    ord_ivec3(segs[seg]), 
                    seed
                );

                // if the mapped interval contains 0, the input interval contains a solution.
                // n.b. - implementation of icontains returns false if lower > upper, but i include mapped.s <= mapped.t for clarity
                if (functionOutput.s <= functionOutput.t && icontains(functionOutput, 0.0) && inLimits(ord_ivec3(segs[seg]))) {
                    foundSolution = true;
                    finalSeed = seed;
                    // set the entire interval to be looked at to be the current half of it
                    // the loop then repeats with this new interval
                    segMin = vec3(segs[seg][0].s, segs[seg][1].s, segs[seg][2].s);
                    segMax = vec3(segs[seg][0].t, segs[seg][1].t, segs[seg][2].t);
                    if (length(segMax - segMin) < solutionAcceptThreshold)
                        solutionAccept = true;
                }
            }
        }
        if (solutionAccept)
            break;
        
        if (!foundSolution) {
            // this code shouldn't do anything
            // the starting interval should be cover the entire renderable area.
            // however, for some reason removing this breaks it. go figure.

            // move segMin to segMax, double the interval size
            vec3 diff = segMax - segMin;
            segMin = segMax;
            segMax += 2. * diff;


            if (!inLimits(ivec3_new_ord(segMin, segMax)))
               break;
        }
	}
    return raySolution(solutionAccept, finalSeed, segHalf);
}



void main() {
    // normalised frag coordinates - 
    // the top-centre of the canvas is (0, 1)
    // the middle-right of the canvas is (a, 0), where a is the aspect ratio = width / height
    vec2 uv = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y; 

    vec3 rayOrigin = u_camPos;
    vec3 rayDir = vec3(1.);
    if (u_projectionID == 100) {
        rayDir = u_camMat * normalize(vec3(uv.x, uv.y, FOCAL_LENGTH));
    }
    else if (u_projectionID == 200) {
        const float orthoScale = 5.;
        rayDir = normalize(u_camTar - u_camPos);
        vec3 camRight = normalize(cross(rayDir, vec3(0., 1., 0.)));
        vec3 camUp = normalize(cross(camRight, rayDir));
        rayOrigin += orthoScale * (camRight * uv.x + camUp * uv.y);
    }


    raySolution raySol = findRaySolution(rayOrigin, rayDir);

    vec3 col = vec3(1.);
    if (raySol.success) {
        #ifdef SURFACE_COL
            const vec3 baseCol = SURFACE_COL;
        #else
            const vec3 baseCol = vec3(1., 0., .5);
        #endif
        const vec3 light = vec3(0.5, 0.5, 1.); // direction from where the light is coming
        vec3 nor = calcNormal(raySol.pos, raySol.seed);
        // // sometimes for functions not defined over all values, calcNormal will return NaN or infinity. 
        // if (isinf(nor.x) || isinf(nor.y) || isinf(nor.z) || isnan(nor.x) || isnan(nor.y) || isnan(nor.z))
        //     nor = vec3(1., 0., 0.);

        #if LIGHTING==0        
            float cosAngle = dot(normalize(nor), normalize(light));
            float intensity = (cosAngle + 2.) * 0.33;

            col = baseCol * intensity;

        #elif LIGHTING==1
            float cosAngle = dot(normalize(nor), normalize(light));
            float intensity = (cosAngle + 2.) * 0.33;
            
            vec3 toLight = light - raySol.pos;

            raySolution reflectionSol = findRaySolution(raySol.pos + 0.001 * toLight, toLight);
            if (reflectionSol.success) 
                intensity *= 0.1;
                
            col = baseCol * intensity;
            

        #elif LIGHTING==2 
            float cosAngle = dot(normalize(nor), normalize(light));
            float intensity1 = (cosAngle + 2.) * 0.33;
            

            raySolution reflectionSol = findRaySolution(raySol.pos + nor*0.01, nor);
            vec3 reflectionCol = vec3(1.);
            if (reflectionSol.success) {                                
                vec3 nor2 = calcNormal(reflectionSol.pos, reflectionSol.seed);
                reflectionCol = baseCol * (dot(normalize(nor2), normalize(light)) + 2.) * 0.33;

            }

            col = baseCol * intensity1 * 0.5 + reflectionCol * 0.5;
            

        #elif LIGHTING==3
            col = nor / 2. + .5;

            col.r = pow(col.r, 5.);
            col.g = pow(col.g, 1.);
            col.b = pow(col.b, 2.);

        #elif LIGHTING==4
            col = 0.5 * end / vec3(LIMITX, LIMITY, LIMITY) + vec3(0.5);

        #elif LIGHTING==5
            col = baseCol * (1.5 - length(end) / length(vec3(LIMITX, LIMITY, LIMITY) ));

        #else
            col = vec3(0.);
        #endif
    }


    float depth = 1000.;
    if (raySol.success) {
        depth = length(raySol.pos - rayOrigin) / CAM_DEPTH;
    }
    //depth = 0.;
    gl_FragDepth = depth;


    //col = vec3(float(finalSeed) / float(SEED_COUNT) + 0.1);

    col = sqrt( col ); // colour correction

    colour = vec4(col, 1.);

}
`;
