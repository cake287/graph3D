const surfacesFS = `#version 300 es
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iCamPos;
uniform vec3 iCamTar;
uniform mat3 iCamMat;
uniform float iZoom;
uniform vec3 iOriginOffset;
uniform int iProjectionID;
uniform float iAngleScale;

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


#define CONST_PI 3.1415926535
#define CONST_PHI 1.618033988749
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
    return icos2(a * iAngleScale);
}
ifloat isin(ifloat a) {
    return isin2(a * iAngleScale);
}




 //////

ifloat sphere(ivec3 p, float r) {
	// x^2 + y^2 + z^2 - r^2
	return isub(ilensq(p),ifloat(r*r));
}

ifloat teardrop(ivec3 p) {
	// -0.5y^5 - 0.5y^4 + x^2 + z^2

	ifloat x2 = ipow2(p[2].st);
	ifloat y2 = ipow2(p[1].st);
	ifloat z2 = ipow2(ipow2(p[0].st));

	ifloat y4 = ipow2(y2);
	ifloat y5 = imul(p[1].st, y4);

	return iadd(iadd(isub(imul(-0.5, y5), imul(0.5, y4)), x2), z2);
}

ifloat cube(ivec3 p, float r) {
    // max( |x|, max( |y|, |z|) ) - r
    return isub( imax( iabs(p[0].xy) , imax(iabs(p[1].xy), iabs(p[2].xy)) ) , ifloat(r));
}

ifloat dcos(ivec3 p) {
    // cos(x) - y
    return isub(isin(p[0].st), p[1].st);
}

ifloat dpow(ivec3 p) {
    // pow(x, 3) - y
    return isub(ipow(p[0].st, 2.0 * cos(iTime)), p[1].st);
}

ifloat oct(ivec3 p, float r) {
    // |x| + |y| + |z| - r
    return isub( iadd( iabs(p[0].xy) , iadd(iabs(p[1].xy), iabs(p[2].xy)) ) , ifloat(r));
}


ifloat steiner(ivec3 p) {
     // x^2.y^2 + y^2.z^2 + x^2.z^2 + xyz
	ifloat x2 = ipow2(p[2].xy);
	ifloat y2 = ipow2(p[1].xy);
	ifloat z2 = ipow2(p[0].xy);
    return iadd( iadd(imul(x2, y2), imul(x2, y2)), iadd(imul(x2, y2), imul(p[0].xy, imul(p[1].xy, p[2].xy))));
}

ifloat dtest1(ivec3 p) {
    // x^2 - y^2 + |z|
    return iadd(isub(ipow2(p[0].xy), ipow2(p[1].xy)), iabs(p[2].xy));
}
ifloat dtest11(ivec3 p) {
    // x^2 - y^2 + z
    return iadd(isub(ipow2(p[0].xy), ipow2(p[1].xy)), p[2].xy);
}

ifloat dtest2(ivec3 p) {
    // x^2 - |y| + |z|
    return iadd(isub(ipow2(p[0].xy), iabs(p[1].xy)), iabs(p[2].xy));
}

ifloat dtest3(ivec3 p) {
    // (x^2)^2 - 2xy + z^2  = 0
    return iadd(isub(ipow2(ipow2(p[0].xy)), imul(2., imul(p[0].xy, p[1].xy))), ipow2(p[2].xy));
}

ifloat dtest4(ivec3 p) {
    // x^5-5x - y  = 0
    return isub(isub(imul(imul(imul(imul(p[0].xy, p[0].xy), p[0].xy), p[0].xy), p[0].xy), imul(5., p[0].xy)), p[1].xy);
}

ifloat dtest5(ivec3 p) {
    // y=cos⁡(max⁡(|x|,|z|))
    return isub
    (
        icos(
            imax(
                iabs(p[0].xy),
                iabs(p[2].xy)
            )
        ),
		p[1].xy
     );
}

ifloat dtest6(ivec3 p) {
    // cos x = sin zy
    return isub(
        icos(
            p[0].st
        ),
        imul(p[1].st, p[2].st)
    );
}

ifloat dtest7(ivec3 p){
    return isub(
        isub(iadd(imul(imul(imul(2.8,p[0].st),p[0].st),iadd(iadd(imul(imul(p[0].st,p[0].st),isub(iadd(imul(imul(2.5,p[0].st),p[0].st),imul(p[1].st,p[1].st)),2.0)),imul(imul(imul(1.2,p[1].st),p[1].st),isub(imul(p[1].st,isub(imul(3.0,p[1].st),0.75)),6.0311))),3.09)),imul(imul(imul(0.98,p[1].st),p[1].st),iadd(imul(imul(p[1].st,p[1].st),isub(imul(p[1].st,p[1].st),3.01)),3.0))),1.005)
        ,0.
    );
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

    return dtest1(p);



    // ifloat recPartT1 = irec(p[0].st, getSeedPart(seed, 0));
    // ifloat recPartT2 = irec(p[2].st, getSeedPart(seed, 1));

    // ifloat rT = isub(iadd(recPartT1, recPartT2), p[1].st);
    // // if (float(seed) * recPart.t > 99.9) { 
    // //     // reverse the bounds of the return value
    // //     // if the bounds are in correct order, the solution is valid
    // //     // if the bounds are in reverse order, the solution is not valid
    // //     return ifloat(r.t, r.s);

    // if (
    //     ((getSeedPart(seed, 0) == -1 && recPartT1.t < -(REC_MAX - 1.)) ||
    //     ( getSeedPart(seed, 0) ==  1 && recPartT1.s >  (REC_MAX - 1.)))
    //     ||
    //     ((getSeedPart(seed, 1) == -1 && recPartT2.t < -(REC_MAX - 1.)) ||
    //     ( getSeedPart(seed, 1) ==  1 && recPartT2.s >  (REC_MAX - 1.)))
    // ) {
    //     return ifloat(rT.t, rT.s);
    // }
    // else {
    //     return rT;
    // }




//    // y = tan x
//    //   = sin x / cos x
//     ifloat recPart = irec(isin(p[0].st), seed);
//     ifloat r = isub(
//         p[1].st, 
//         imul(
//             isin(p[0].st),
//             recPart
//         )
//     );
//     if ((seed == -1 && recPart.t < -99.) ||
//         (seed ==  1 && recPart.s >  99.)
//     )
//         return ifloat(r.t, r.s);
//     else
//         return r;

    // // y^2 = |x|^(z/y)
    // ifloat recPart = irec(p[1].st, seed);
    // ifloat r = isub(
    //     imul(p[1].st, p[1].st), 
    //     iexp(
    //         imul(
    //             imul(p[2].st, recPart), 
    //             iAbsLn(p[0].st)
    //         )
    //     )
    // );
    // if ((seed == -1 && recPart.t < -99.) ||
    //     (seed ==  1 && recPart.s >  99.)
    // ) {
    //     return ifloat(r.t, r.s);
    // }
    // else {
    //     return r;
    // }
  
}

ifloat map(ivec3 p, int seed) {
    ivec3 offsetP = isub(p, iOriginOffset);
    ivec3 scaledP = imul(vec3(iZoom, iZoom, iZoom), offsetP);

    return map2(scaledP, seed);
}


// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
// https://www.shadertoy.com/view/wdXGDr
vec3 calcNormal(vec3 pos, int seed)
{
    vec2 e = vec2(1.0,-1.0);
    float eps = 0.005;// * iZoom;
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


void main() {
    const float cameraDepth = 30.;
    const float focalLength = 1.5;

    // normalised frag coordinates - 
    // the top-centre of the canvas is (0, 1)
    // the middle-right of the canvas is (a, 0), where a is the aspect ratio = width / height
    vec2 uv = (-iResolution.xy + 2.0*gl_FragCoord.xy)/iResolution.y; 

    vec3 rayOrigin = iCamPos;
    vec3 rayDir = vec3(1.);
    if (iProjectionID == 100) {
        rayDir = iCamMat * normalize(vec3(uv.x, uv.y, focalLength));
    }
    else if (iProjectionID == 200) {
        const float orthoScale = 5.;
        rayDir = normalize(iCamTar - iCamPos);
        vec3 camRight = normalize(cross(rayDir, vec3(0., 1., 0.)));
        vec3 camUp = normalize(cross(camRight, rayDir));
        rayOrigin += orthoScale * (camRight * uv.x + camUp * uv.y);
    }


    float initialRayLength = cameraDepth;// * iZoom;
	float solutionAcceptThreshold = 1e-3;


    vec3 segMin = rayOrigin;
    vec3 segHalf = vec3(0.);
    vec3 segMax = rayOrigin + initialRayLength*rayDir;

    bool hit = false;
    int finalSeed = -1;
    for (int i = 0; i < 256; i++) {
        segHalf = 0.5 * (segMin + segMax);

        // the bisected interval segments to be tested
        ivec3 segs[2] = ivec3[2](
            ivec3_new(segMin, segHalf),
            ivec3_new(segHalf, segMax)
        );

        bool foundSolution = false;
        for (int seg = 0; seg < segs.length() && !foundSolution; seg++) {
            for (int seed = 0; seed < SEED_COUNT && !foundSolution; seed++) {
                // map() takes the input interval, and returns the output of equation given this interval
                ifloat mapped = map(
                    ord_ivec3(segs[seg]), 
                    seed
                );

                // if the mapped interval contains 0, the input interval contains a solution.
                // n.b. - implementation of icontains returns false if lower > upper, but i include mapped.s <= mapped.t for clarity
                if (mapped.s <= mapped.t && icontains(mapped, 0.0) && inLimits(ord_ivec3(segs[seg]))) {
                    foundSolution = true;
                    finalSeed = seed;
                    // set the entire interval to be looked at to be the current half of it
                    // the loop then repeats with this new interval
                    segMin = vec3(segs[seg][0].s, segs[seg][1].s, segs[seg][2].s);
                    segMax = vec3(segs[seg][0].t, segs[seg][1].t, segs[seg][2].t);
                    if (length(segMax - segMin) < solutionAcceptThreshold)
                        hit = true;
                }
            }
        }
        if (hit)
            break;
        
        if (!foundSolution) {
            // the first part of this code shouldn't do anything
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
    vec3 end = segHalf;

    vec3 col = vec3(1.);
    if (hit) {
        #if LIGHTING==0        
            const vec3 light = vec3(0.5, 0.5, 1.); // direction from where the light is comnig
            vec3 nor = calcNormal(end, finalSeed);

            // // sometimes for functions not defined over all values, calcNormal will return NaN or infinity. 
            // if (isinf(nor.x) || isinf(nor.y) || isinf(nor.z) || isnan(nor.x) || isnan(nor.y) || isnan(nor.z))
            //     nor = vec3(1., 0., 0.);

            float cosAngle = dot(normalize(nor), normalize(light));
            float intensity = (cosAngle + 2.) * 0.33;

            #ifdef SURFACE_COL
                const vec3 baseCol = SURFACE_COL;
            #else
                const vec3 baseCol = vec3(1, 0., .5);
            #endif

            col = baseCol * intensity;


        #elif LIGHTING==1
            vec3 nor = calcNormal(end, finalSeed);
            col = nor / 2. + .5;

            col.r = pow(col.r, 5.);
            col.g = pow(col.g, 1.);
            col.b = pow(col.b, 2.);

        #elif LIGHTING==2
            col = 0.5 * end / vec3(LIMITX, LIMITY, LIMITY) + vec3(0.5);

        #elif LIGHTING==3
            const vec3 baseCol = vec3(0., .5, 1.);
            col = baseCol * (1.5 - length(end) / length(vec3(LIMITX, LIMITY, LIMITY) ));

        #else
            col = vec3(0.);
        #endif
    }


    float depth = 1000.;
    if (hit) {
        depth = length(end - rayOrigin) / cameraDepth;
    }
    //depth = 0.;
    gl_FragDepth = depth;


    //col = vec3(float(finalSeed) / float(SEED_COUNT) + 0.1);

    col = sqrt( col ); // colour correction

    colour = vec4(col, 1.);

}
`;
