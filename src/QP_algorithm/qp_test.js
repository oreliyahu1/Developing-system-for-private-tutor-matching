	//var qp = require('quadprog');
	var qp = require('./quadprog');
	var Dmat = [], dvec = [], Amat = [], bvec = [], res;

	
function calcQP(postive_vec, negative_vec, to_minimize_vec, P)
{
	const epsilon = 0.000001;
	var Qmat = [], d_vec = [], Amat = [], b_vec = [];

	//calculate with saved data and body
	//build the minimize function
	for(let i = 1; i <= to_minimize_vec.length; i++){
		d_vec[i] = to_minimize_vec[i-1];  //f(x,m) = (x1 - m1)^2 + (x2-m2)^2 +..+ (xn-mn)^2 needs to be minimized
	}

	for(let i = 1; i <= to_minimize_vec.length; i++){
		Qmat[i] = [];
		for(let j=1; j <= to_minimize_vec.length; j++){
			Qmat[i][j] = (i==j) ? 1 : 0;
		}
	}

	//build the constraints
	for(let i=1; i <= to_minimize_vec.length; i++){
		Amat[i] = [];
		for(var j=1; j <= to_minimize_vec.length; j++){
			Amat[i][j] = (i==j) ? 1 : 0;
		}
		for(let w=0; w < postive_vec.length; w++){
			Amat[i][j++] = postive_vec[w][i-1];
		}
		for(let w=0; w < negative_vec.length; w++){
			Amat[i][j++] = -negative_vec[w][i-1];
		}
	}

	//build b_vec
	for(var i=1; i <= to_minimize_vec.length; i++){
		b_vec[i] = 0 + epsilon;
	}
	
	for(let j=0; j <postive_vec.length; j++){
		b_vec[i++] = P;
	}
	
	for(let j=0; j <negative_vec.length; j++){
		b_vec[i++] = -(P - epsilon);
	}

	
	console.log("calcQP");
	console.log(b_vec);
	console.log(d_vec);
	console.log(Amat);
	console.log(Qmat);
	
	res = qp.solveQP(Qmat, d_vec, Amat, b_vec);
	console.log(res);
	return res.message ? null : res.solution.slice(1);
}
	// [0.5, 0.6, 0.8, 0.8, 1]
	//grade_rate [10, 5, 5, 5, 10]
	//[30, 25, 20, 15, 10]

	to_minimize_vec = [0.5, 0.6, 0.8, 0.8, 1];
	postive_vec = [];
	negative_vec = [[30, 25, 20, 15, 10]];

	console.log(calcQP(postive_vec, negative_vec, to_minimize_vec, 50));
	return;

	Dmat[1] = [];
	Dmat[2] = [];
	Dmat[3] = [];
	Dmat[1][1] = 1;
	Dmat[2][1] = 0;
	Dmat[3][1] = 0;
	Dmat[1][2] = 0;
	Dmat[2][2] = 1;
	Dmat[3][2] = 0;
	Dmat[1][3] = 0;
	Dmat[2][3] = 0;
	Dmat[3][3] = 1;

	dvec[1] = 0;
	dvec[2] = 5;
	dvec[3] = 0;

	Amat[1] = [];
	Amat[2] = [];
	Amat[3] = [];
	Amat[1][1] = -4;
	Amat[2][1] = -3;
	Amat[3][1] = 0;
	Amat[1][2] = 2;
	Amat[2][2] = 1;
	Amat[3][2] = 0;
	Amat[1][3] = 0;
	Amat[2][3] = -2;
	Amat[3][3] = 1;
	Amat[1][4] = 0;
	Amat[2][4] = -2;
	Amat[3][4] = 1;

	bvec[1] = -8;
	bvec[2] = 2;
	bvec[3] = 0;
	bvec[4] = 1;

	console.log("dmaDmatt");
	console.log(Dmat);
	console.log("Amat");
	console.log(Amat);
	console.log("dvec");
	console.log(dvec);
	console.log("bvec");
	console.log(bvec);
	res = qp.solveQP(Dmat, dvec, Amat, bvec)
	console.log("res");
	console.log(res);