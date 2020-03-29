const intialState = {
	venueId: 0
};


const reducer = (state = intialState, action) => {

	switch(action.type){
		case "CHANGEVENUEID":
			return {
				...state,
				venueId: action.venueId
			};
		break;

		default:
			/* no default action*/
		break;
	}

	return state;
};



export default reducer;