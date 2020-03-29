const getDefaultTargetChannels = () => ({
    primary     :  {icon:'',    isEnabled: false, channel:'', percentage: 0, currentTarget: '', members: 0},
    secondary   :  {icon:'',    isEnabled: false, channel:'', percentage: 0, currentTarget: '', members: 0},
    tertiary    :  {icon:'',    isEnabled: false, channel:'', percentage: 0, currentTarget: '', members: 0},
    quarternary :  {icon:'',    isEnabled: false, channel:'', percentage: 0, currentTarget: '', members: 0}
});

const getDefaultCampaign = () => ({trigger_amount: '',selectedCampaign: '', name: '', detail: '', trigger_type: '', trigger_value: 1, tags: []});

const getDefaultSegment = () => ({type: '', segments: [], segment_users: {}, new_segment: {}});// segments: selected saved segments(array of object).

const getDefaultBeaconsData = () => ({selectedFloorPlan: '', selectedFloorPlanName: "", selectedFloorImageName: "", beacon_name: "", beacon_event: "", beacon_id: '', trigger_value_hour: "", trigger_value_min: ""});

const getDefaultMessageBuilder = (type = '') => {
    let msgBuilder = {
        push:   {type: '',venue_name:VenueName, message: '', resource: '', other: {content: {}, url:''}},
        email:  {type: '',venue_name:VenueName, message: '', resource: '', other: {content: {}, emailID:{}}},
        sms:    {type: '', venue_name:VenueName,message: '', resource: '', other: {content: {}, url:''}}
    };

    if (type)
        return msgBuilder[type];
    return msgBuilder;
};

const getDefaultGameToCreatePayload = () => ({title: '', description: '', start_date: 'n/a', end_date: 'n/a', outcomes: [], missions: [], is_competition: 0});
const getDefaultMissionToCreatePayload = () => ({title: '', description: '', from_date: null, end_date: null, target_segments: '', outcomes: []});

const defaultState = {
    campaign: getDefaultCampaign(),
    trigger_type: '',
    segment: getDefaultSegment(),
    currentChannel: '',
    targetChannels: getDefaultTargetChannels(),
    messageBuilder : getDefaultMessageBuilder(),
    campaignSchedulerType: '',
    schedule: {},
    beaconsData: getDefaultBeaconsData(),
    floors: [],
    beacons: [],
    suggestedTags: [],
    selectedTab: 1,
    highestVisitedTab: 1,
    isEditMode: false,
    campaignID: 0,
    savedSegmentsList: [],
    businessList: [],
    pointTypesList:{},
    tmpMessageBuilder: {},
    selectedData:[],
    treeData:[],
    checkedKeys:[],
    categoryList:[],
    games: [],
    gameToCreate: getDefaultGameToCreatePayload(),
    missionToCreate: getDefaultMissionToCreatePayload(),
    gameMissionTypeToCreate: 'list',
    competitionList: [],
    petPackList: [],
    IsCompetition: 0,
    outcome_to_edit: -1,
    mission_outcome_to_edit: -1,
    selected_game: -1,
    target_user:'new',
    punchCardListData:[],
    voucherListData:[]
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_SELECTED_TAB_VALUE':
            if (state.gameMissionTypeToCreate === 'game' && (action.tabs.selectedTab === 3 || action.tabs.selectedTab === 4))
                return {...state};
            return {...state, ...action.tabs};
        case 'SET_CAMPAIGN_TYPE':
            return {...state, campaign: {...getDefaultCampaign(), ...action.campaign}, segment: getDefaultSegment(), beaconsData: getDefaultBeaconsData(), selectedTab: 1, highestVisitedTab: 1};
        case  'ADD_CAMPAIGN_VALUE':
            return {...state, campaign: {...state.campaign, ...action.campaign}};
        case 'ADD_SUGGESTED_TAGS':
            return {...state, suggestedTags: action.suggestedTags};
        case 'SET_SEGMENT_TYPE':
            return {...state, trigger_type: '', segment: {...state.segment, ...action.segment}};
        case 'ADD_SEGMENT_VALUE':
            return {...state, segment: {...state.segment, ...action.segment}};
            /*return {...state, trigger_type: '', segment: {...state.segment, ...action.segment}};*/
        case 'SET_SAVED_SEGMENT':
            return {...state, segment: {...state.segment, ...action.segments}};
            /*return {...state, segment: {...state.segment, ...action.segments}, targetChannels: getDefaultTargetChannels()};*/
        case 'SET_SEGMENT_USERS':
            return {...state, segment: {...state.segment, segment_users:{...state.segment.segment_users,...action.segment}}};
        case 'CLEAR_SEGMENT':
            return {...state, segment: {...state.segment, ...action.segment}};
        case 'ADD_NEW_SEGMENT_VALUE':
            return {...state, segment: {...state.segment, new_segment: {...state.segment.new_segment, ...action.new_segment}}};
        case 'SET_TRIGGER_TYPE':
            return {...state, trigger_type: action.triggerType, targetChannels: getDefaultTargetChannels()};
        case 'SET_TARGET_CHANNELS_VALUE':
            return {...state, targetChannels: {...state.targetChannels, ...action.targetChannel}};
        case 'SET_BEACONS_DATA':
            return {...state, beaconsData: {...state.beaconsData, ...action.beaconsData}};
        case 'ADD_BEACONS_LIST':
            return {...state, beacons: action.beacons};
        case 'ADD_FLOORS_LIST':
            return {...state, floors: action.floors};
        case 'ADD_MESSAGE_BUILDER_VALUE': {
            let tmpMessageBuilder = state.tmpMessageBuilder;
            let key = Object.keys(action.messageBuilder)[0] || "";

            if (tmpMessageBuilder.hasOwnProperty(key)) {
                tmpMessageBuilder[key] = {...tmpMessageBuilder[key], [action.messageBuilder[key].type] : action.messageBuilder[key]};
            }//..... end if() .....//

            return {...state, messageBuilder: {...state.messageBuilder, ...action.messageBuilder}, tmpMessageBuilder};
        }
        case 'ADD_CAMPAIGN_SCHEDULER_TYPE':
            return {...state, ...action.schedulerType};
        case 'ADD_SCHEDULE_VALUE':
            return {...state, ...action.schedule};
        case 'RESET_CAMPAIGN_BUILDER':
            return { ...state,
                    campaign: getDefaultCampaign(),
                    trigger_type: '',
                    segment: getDefaultSegment(),
                    targetChannels: getDefaultTargetChannels(),
                    messageBuilder : getDefaultMessageBuilder(),
                    campaignSchedulerType: '',
                    schedule: {},
                    beaconsData: getDefaultBeaconsData(),
                    selectedTab: 1,
                    highestVisitedTab: 1,
                    isEditMode: false,
                    campaignID: 0,
                    tmpMessageBuilder: {},
                    treeData:[],
                    checkedKeys:[],
                    selectedData:[],
                    games: [],
                    gameToCreate: getDefaultGameToCreatePayload(),
                    missionToCreate: getDefaultMissionToCreatePayload(),
                    gameMissionTypeToCreate: 'list',
                    IsCompetition: 0,
                    outcome_to_edit: -1,
                    mission_outcome_to_edit: -1

                    /*competitionList: []
                     petPackList: []*/
            };
        case 'ADD_EDIT_CAMPAIGN_DATA':
            return {...state, ...action.campaign};
        case 'ADD_SAVED_SEGMENT_LIST':
            return {...state, savedSegmentsList: action.segments};
        case 'SET_CURRENT_CHANNEL': {
            let tmpMessageBuilder = state.tmpMessageBuilder;
            if (! tmpMessageBuilder.hasOwnProperty(action.channel))
                tmpMessageBuilder[action.channel] = {};

            return {...state,currentChannel: action.channel,tmpMessageBuilder};
        }
        case 'SET_BUSINESS_LIST':
            return {...state, businessList: action.businesses};
        case 'SET_POINT_TYPE_LIST':
            return {...state, pointTypesList: action.pointTypesList};
        case 'SET_REWARD_SMS_BUILDER_TYPE':
            return {...state, messageBuilder:{...state.messageBuilder, [action.channel]:{...getDefaultMessageBuilder(action.channel), type: action.selectedType}}, IsCompetition: 0};
        case 'SET_EMAIL_BUILDER_TYPE':
            return {...state, messageBuilder:{...state.messageBuilder, 'email':{...getDefaultMessageBuilder('email'), type: action.selectedType}}};
        case 'SET_SELECTED_EMAIL':
            return {...state, messageBuilder:{...state.messageBuilder, 'email':{...state.messageBuilder.email, other: {...state.messageBuilder.email.other, emailID:action.template}}}};
        case 'SET_ALERT_MESSAGE_BUILDER_TYPE': {

            let tmpMessageBuilder = state.tmpMessageBuilder;
            let defaultChannelValue = {...getDefaultMessageBuilder(action.channel), type: action.selectedType};

            if (tmpMessageBuilder.hasOwnProperty(action.channel)) {
                if (!tmpMessageBuilder[action.channel].hasOwnProperty(action.selectedType))
                    tmpMessageBuilder[action.channel] = {...tmpMessageBuilder[action.channel], [action.selectedType]: {}};
                else {
                    if (tmpMessageBuilder[action.channel].hasOwnProperty(action.selectedType))
                        defaultChannelValue = {...defaultChannelValue, ...tmpMessageBuilder[action.channel][action.selectedType]};
                }//..... end if-else() .....//
            } else {
                tmpMessageBuilder[action.channel] = {[action.selectedType]: {}};
            }//..... end if-else() .....//
            return {...state, IsCompetition: (state.IsCompetition == 0 ? ( (action.selectedType === 'competition') ? 1 : 0) : 1) , messageBuilder:{...state.messageBuilder, [action.channel]: defaultChannelValue}, tmpMessageBuilder/*, IsCompetition: action.selectedType === 'competition' ? 1 : 0*/};
        }
        case 'SET_TREE_DATA':
            return {...state,selectedData:action.data};
        case 'SET_MAIN_TREE':
            return {...state,treeData:action.data};
        case 'SET_MAIN_TREE_SELECTED':
            return {...state,checkedKeys:action.data};
        case 'RESET_TREE_STRUCTURE':
                return {...state, treeData:[]};

        case 'ADD_GAME_VALUE':
            return {...state, gameToCreate: {...state.gameToCreate, ...action.game}};
        case 'SET_GAME_MISSION_CREATING_TYPE':
            return {
                ...state,
                gameMissionTypeToCreate: action.value,
                selectedTab: action.tab,
                highestVisitedTab: action.tab,
                gameToCreate: getDefaultGameToCreatePayload(),
                targetChannels: getDefaultTargetChannels(),
                messageBuilder : getDefaultMessageBuilder(),
                missionToCreate: getDefaultMissionToCreatePayload(),
                segment: getDefaultSegment(),
                tmpMessageBuilder: {},
                trigger_type: '',
                currentChannel: '',
            };
        case 'SET_GAME_DATA': {
            let games = state.games;
            let competition_ids = [];
            if (state.gameMissionTypeToCreate === 'game-outcome')
                games = games.filter((g) => g.title !== state.gameToCreate.title);

            let outcomes = [];
            if(state.outcome_to_edit >= 0) {
                state.gameToCreate.outcomes[state.outcome_to_edit] = action.value;
                outcomes = state.gameToCreate.outcomes;
            }
            else {
                outcomes = [...state.gameToCreate.outcomes, action.value];
            }

            let action_value = [];
            outcomes.map((value,key)=>{
                action_value = typeof value.action_value === 'string' ? JSON.parse(value.action_value) : value.action_value;
                action_value.forEach(function (av) {
                    if(av.value.type == "competition"){
                        competition_ids.push(av.value.other.content.competition.id);
                    }

                });

            });
            //let action_value = typeof outcomes[0].action_value === 'string' ? JSON.parse(outcomes[0].action_value) : outcomes[0].action_value;

            /*action_value.forEach(function (av) {
                targetChannels[av.type].channel = av.name;
                targetChannels[av.type].currentTarget = av.name;
                targetChannels[av.type].isEnabled = true;
                targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
            });*/
            if (state.gameMissionTypeToCreate === 'game' && state.gameToCreate.hasOwnProperty('id') && state.gameToCreate.id) {
                let [game] = games.filter((g) => g.id === state.gameToCreate.id);

                if (Object.keys(game).length > 0) {
                    let [ignore, ...allOutComes] = game.outcomes;
                    outcomes = [action.value, ...allOutComes];
                }//..... end if() .....//

                games = games.filter((g) => g.id !== state.gameToCreate.id);
            }//..... end if() .....//


            if (state.gameToCreate.id === 999999)
                delete state.gameToCreate.id;


            games = [...games, {...state.gameToCreate,competition_ids, is_competition: (state.gameToCreate.is_competition || state.IsCompetition), outcomes}];
            return {
                ...state,
                games: games,
                gameToCreate: getDefaultGameToCreatePayload(),
                campaign: {...state.campaign, target_type: ''},
                targetChannels: getDefaultTargetChannels(),
                gameMissionTypeToCreate: 'list',
                selectedTab: 2,
                highestVisitedTab: 2,
                messageBuilder : getDefaultMessageBuilder(),
                tmpMessageBuilder: {},
                trigger_type: '',
                currentChannel: '',
                IsCompetition: 0
            };
        }
        case 'SET_GAME_FOR_ADDING_MORE_OUTCOME':
            return {...state, ...action.data};












        case 'SET_GAME_FOR_ADDING_MORE_MISSION':
            return {...state, ...action.data, highestVisitedTab: state.selectedTab};
        case 'ADD_MISSION_VALUE':
            return {...state, missionToCreate: {...state.missionToCreate, ...action.mission}};
        case 'ADD_MISSION_SCHEDULE_VALUE':
            return {...state, missionToCreate: {...state.missionToCreate, ...action.scheduleObject}};
        case 'SET_GAME_MISSION_DATA':{
            let games = state.games;

            if (state.gameMissionTypeToCreate === 'game-mission')
                if (state.gameToCreate.hasOwnProperty('id') && state.gameToCreate.id)
                    games = games.filter((g) => g.id !== state.gameToCreate.id);
                else
                    games = games.filter((g) => g.title !== state.gameToCreate.title);

            let startDate = state.gameToCreate.start_date;
            let endDate   = state.gameToCreate.end_date;

            if (startDate !== 'n/a') {
                if (state.missionToCreate.from_date) {
                    let mStartDate = state.missionToCreate.from_date.split('-');
                    let mStartTime = mStartDate[2].split(' ');
                    let mStartDateTime = moment(`${mStartTime[0]}-${mStartDate[1]}-${mStartDate[0]} ${mStartTime[1]}`);

                    let gStartDate = startDate.split('-');
                    let gStartTime = gStartDate[2].split(' ');
                    let gStartDateTime = moment(`${gStartTime[0]}-${gStartDate[1]}-${gStartDate[0]} ${gStartTime[1]}`);

                    if (mStartDateTime.isBefore(gStartDateTime))
                        startDate = state.missionToCreate.from_date;
                }//..... end if() .....//
            } else
                startDate = state.missionToCreate.from_date ? state.missionToCreate.from_date : 'n/a';

            if (endDate !== 'n/a') {
                if (state.missionToCreate.end_date) {
                    let mEndDate = state.missionToCreate.end_date.split('-');
                    let mEndTime = mEndDate[2].split(' ');
                    let mEndDateTime = moment(`${mEndTime[0]}-${mEndDate[1]}-${mEndDate[0]} ${mEndTime[1]}`);

                    let gEndDate = endDate.split('-');
                    let gEndTime = gEndDate[2].split(' ');
                    let gEndDateTime = moment(`${gEndTime[0]}-${gEndDate[1]}-${gEndDate[0]} ${gEndTime[1]}`);

                    if (mEndDateTime.isAfter(gEndDateTime))
                        endDate = state.missionToCreate.end_date;
                }//..... end if() .....//
            } else
                endDate = state.missionToCreate.end_date ? state.missionToCreate.end_date : "n/a";

            let oldMissions = state.gameToCreate.missions;
            let currentMission = state.missionToCreate;
            let game = state.gameToCreate;
            let newOutcome = [{action_type: action.value.action_type, action_value: action.value.action_value}];
            let val = action.value.action_value;
            if(action.value.action_value != "object")
                val = JSON.parse(action.value.action_value);
            if(val[0].value.type == "animation" || val[0].value.type == "competition"){
                game.is_competition = 1;
            }

            if(val[0].value.type == "competition"){
                game.competition_ids.push(val[0].value.other.content.competition.id);
            }


            if (state.missionToCreate.hasOwnProperty('isEdit') && state.missionToCreate.isEdit) {
                let [targetMission] = oldMissions.filter(m => m.id === currentMission.id);
                if (targetMission) {
                    let [, ...extraOutcomes] = targetMission.outcomes;
                    newOutcome = [...newOutcome, ...extraOutcomes];
                }//..... end if() .....//

                oldMissions = oldMissions.filter(om => om.id !== currentMission.id);

                if (currentMission.id === 999999)
                    delete currentMission.id;

                if (game.id === 999999)
                    delete game.id;

                delete currentMission.isEdit;
            } //..... end if() .....//

            games = [...games, {...game, start_date: startDate, end_date: endDate, missions: [...oldMissions, {...currentMission, target_segments: action.value.target_segments,  outcomes: newOutcome}]}];

            return {
                ...state,
                games: games,
                gameToCreate: getDefaultGameToCreatePayload(),
                campaign: {...state.campaign, target_type: ''},
                targetChannels: getDefaultTargetChannels(),
                gameMissionTypeToCreate: 'list',
                selectedTab: 2,
                highestVisitedTab: 2,
                messageBuilder : getDefaultMessageBuilder(),
                tmpMessageBuilder: {},
                trigger_type: '',
                missionToCreate: getDefaultMissionToCreatePayload(),
                segment: getDefaultSegment(),
                currentChannel: ''
            };
        }
        case 'SET_DELETE_MISSION': {
            return {...state, games: [...state.games.filter((g) => g !== action.game), action.game]};
        }
        case 'SET_MISSION_FOR_ADDING_OUTCOME': {
            let {game, mission} = action.value;
            // let action_type = mission.outcomes[0].action_type;
            // let action_value = typeof mission.outcomes[0].action_value === 'string' ? JSON.parse(mission.outcomes[0].action_value) : mission.outcomes[0].action_value;
            // let targetChannels = getDefaultTargetChannels();
            // action_value.forEach(function (av) {
            //     targetChannels[av.type].channel = av.name;
            //     targetChannels[av.type].currentTarget = av.name;
            //     targetChannels[av.type].isEnabled = true;
            //     targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
            // });

            // return {
            //     ...state, gameToCreate: game, trigger_type: action_type, targetChannels: targetChannels,
            //     missionToCreate: mission, gameMissionTypeToCreate: 'mission-outcome', selectedTab: 5
            // };

            // channel: "sms"
            // currentTarget: "sms"
            // icon: "smsIcon_white@2x.png"
            // isEnabled: true
            // members: 0
            // percentage: 0
            let targetChannels = getDefaultTargetChannels();
                targetChannels['primary'].channel = 'push';
                targetChannels['primary'].currentTarget = 'push';
                targetChannels['primary'].isEnabled = true;
                targetChannels['primary'].icon = 'ap_white@2x.png';
                targetChannels['primary'].members = 0;
                targetChannels['primary'].percentage = 0;
            return {
                ...state, gameToCreate: game, trigger_type: 'alert', targetChannels: targetChannels,
                missionToCreate: mission, gameMissionTypeToCreate: 'mission-outcome', selectedTab: 5
            };


        }

        case 'SET_GAME_FOR_EDITING_OUTCOME':
            let game = action.data.gameToCreate;
            let outcome_to_edit = action.data.selected_outcome;
            let targetChannels = getDefaultTargetChannels();
            let action_value = typeof game.outcomes[outcome_to_edit].action_value === 'string' ? JSON.parse(game.outcomes[outcome_to_edit].action_value) : game.outcomes[outcome_to_edit].action_value;
            let currentChannel = '';
            let msgBldr = getDefaultMessageBuilder();
            action_value.forEach(function (av) {
                targetChannels[av.type].channel = av.name;
                targetChannels[av.type].currentTarget = av.name;
                targetChannels[av.type].isEnabled = true;
                targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
                msgBldr[av.name] = av.value;
                if (! currentChannel)
                    currentChannel = av.name;

            });


            let games = state.games;
            let competition_ids = [];
            if (state.gameMissionTypeToCreate === 'game-outcome')
                games = games.filter((g) => g.title !== state.gameToCreate.title);


            // if (state.gameMissionTypeToCreate === 'game' && state.gameToCreate.hasOwnProperty('id') && state.gameToCreate.id) {
            //     let [game] = games.filter((g) => g.id === state.gameToCreate.id);
            //
            //     if (Object.keys(game).length > 0) {
            //         let [ignore, ...allOutComes] = game.outcomes;
            //         outcomes = [action.value, ...allOutComes];
            //     }//..... end if() .....//
            //
            //     games = games.filter((g) => g.id !== state.gameToCreate.id);
            // }//..... end if() .....//
            //
            // if (state.gameToCreate.id === 999999)
            //     delete state.gameToCreate.id;
            //
            // games = [...games, {...state.gameToCreate,competition_ids, is_competition: (state.gameToCreate.is_competition || state.IsCompetition), outcomes}];
            return {
                ...state,
                games: games,
                trigger_type: game.outcomes[outcome_to_edit].action_type,
                targetChannels: targetChannels,
                segment: getDefaultSegment(),
                tmpMessageBuilder: msgBldr,
                messageBuilder: msgBldr,
                currentChannel: currentChannel,
                gameMissionTypeToCreate: 'game-outcome',
                selectedTab: action.data.selectedTab,
                highestVisitedTab: action.data.selectedTab,
                gameToCreate: action.data.gameToCreate,
                outcome_to_edit: outcome_to_edit,
            };


        case 'SET_MISSION_FOR_EDITING_OUTCOME': {
            //let {game, mission} = action.value;
            let game = action.value.game;
            let mission = action.value.mission;
            let outcome_to_edit = action.value.selected_outcome;
            let action_type = mission.outcomes[outcome_to_edit].action_type;
            let action_value = typeof mission.outcomes[outcome_to_edit].action_value === 'string' ? JSON.parse(mission.outcomes[outcome_to_edit].action_value) : mission.outcomes[outcome_to_edit].action_value;
            let targetChannels = getDefaultTargetChannels();
            let msgBldr = getDefaultMessageBuilder();
            action_value.forEach(function (av) {
                targetChannels[av.type].channel = av.name;
                targetChannels[av.type].currentTarget = av.name;
                targetChannels[av.type].isEnabled = true;
                targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
                msgBldr[av.name] = av.value;
            });



            return {
                ...state, gameToCreate: game, trigger_type: action_type, targetChannels: targetChannels,
                tmpMessageBuilder: msgBldr,
                messageBuilder: msgBldr,
                missionToCreate: mission, gameMissionTypeToCreate: 'mission-outcome', selectedTab: 5, highestVisitedTab: 5,
                mission_outcome_to_edit: outcome_to_edit,
                //selected_mission: action.selected_mission,
                //selected_game: action.selected_game
            };
        }

        case 'SET_MISSION_OUTCOME': {

            let mission = '';
            if(state.mission_outcome_to_edit >= 0) {
                let mission_outcomes = state.missionToCreate.outcomes;
                mission_outcomes[state.mission_outcome_to_edit] = {action_type: action.obj.action_type, action_value: action.obj.action_value};
                mission = {...state.missionToCreate, outcomes: mission_outcomes};
            }
            else {
                mission = {...state.missionToCreate, outcomes: [...state.missionToCreate.outcomes, {action_type: action.obj.action_type, action_value: action.obj.action_value}]};
            }


            let existMissions = state.gameToCreate.missions.filter((m)  => m.title !== mission.title);
            let game = {...state.gameToCreate, missions: [...existMissions, mission]};
            let games = state.games.filter((g) => g.title !== state.gameToCreate.title);


            let val = action.obj.action_value;
            if(action.obj.action_value != "object")
                val = JSON.parse(action.obj.action_value);

            if(val[0].value.type == "animation" || val[0].value.type == "competition"){
                game.is_competition = 1;
            }
            if(val[0].value.type == "competition"){
                game.competition_ids.push(val[0].value.other.content.competition.id);
            }


            return {...state, games: [...games, game], gameToCreate: getDefaultGameToCreatePayload(),
                targetChannels: getDefaultTargetChannels(),
                gameMissionTypeToCreate: 'list',
                selectedTab: 2,
                messageBuilder : getDefaultMessageBuilder(),
                tmpMessageBuilder: {},
                trigger_type: '',
                missionToCreate: getDefaultMissionToCreatePayload(),
            };
        }



        case 'SET_MISSION_FOR_DUPLICATION': {
            let {game, mission} = action.value;
            delete mission.id;

            return {
                ...state, gameToCreate: game, missionToCreate: {...mission, title: mission.title+" (duplicate)"}, gameMissionTypeToCreate: 'mission-duplication'
            };
        }

        case 'SET_DUPLICATED_MISSION': {
            let games = state.games;
            games = games.filter((g) => g !== state.gameToCreate);
            games = [...games, {...state.gameToCreate, missions: [...state.gameToCreate.missions, {...state.missionToCreate}]}];

            return {
                ...state,
                games: games,
                gameToCreate: getDefaultGameToCreatePayload(),
                campaign: {...state.campaign, target_type: ''},
                targetChannels: getDefaultTargetChannels(),
                gameMissionTypeToCreate: 'list',
                selectedTab: 2,
                messageBuilder : getDefaultMessageBuilder(),
                tmpMessageBuilder: {},
                trigger_type: '',
                missionToCreate: getDefaultMissionToCreatePayload(),
                segment: getDefaultSegment(),
                currentChannel: ''
            };
        }
        case 'SET_COMPETITION_LIST':
            return {...state, competitionList: action.competitionList };
        case 'SET_PET_PACK_LIST':
            return {...state, petPackList: action.petPackList };
        case 'SET_IS_COMPETITION':
            return {...state, IsCompetition: action.IsCompetition };
        case 'SET_GAME_TO_EDIT': {
            let triggerType = '';
            let targetChannels = getDefaultTargetChannels();
            let msgBldr = getDefaultMessageBuilder();
            let currentChannel = '';

            if (action.game.outcomes.length) {
                let [outcome] = action.game.outcomes;

                if (! triggerType)
                    triggerType = outcome.action_type;

                let action_value = typeof outcome.action_value === 'string' ? JSON.parse(outcome.action_value) : outcome.action_value;

                action_value.forEach(function (av) {
                    targetChannels[av.type].channel = av.name;
                    targetChannels[av.type].currentTarget = av.name;
                    targetChannels[av.type].isEnabled = true;
                    targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
                    msgBldr[av.name] = av.value;
                    if (! currentChannel)
                        currentChannel = av.name;
                });
            }//..... end if() .....//

            if (! action.game.hasOwnProperty('id'))
                action.game.id = 999999;

            return {
                ...state,
                gameMissionTypeToCreate: action.gmType,
                selectedTab: action.tab,
                highestVisitedTab: action.tab,
                gameToCreate: action.game,
                trigger_type: triggerType,
                targetChannels: targetChannels,
                messageBuilder: msgBldr,
                missionToCreate: getDefaultMissionToCreatePayload(),
                segment: getDefaultSegment(),
                tmpMessageBuilder: msgBldr,
                currentChannel: currentChannel,
            };
        }
        case 'SET_MISSION_TO_EDIT': {
            let {game, mission} = action.value;
            let action_type = mission.outcomes[0].action_type;
            let action_value = typeof mission.outcomes[0].action_value === 'string' ? JSON.parse(mission.outcomes[0].action_value) : mission.outcomes[0].action_value;
            let targetChannels = getDefaultTargetChannels();
            let msgBldr = getDefaultMessageBuilder();
            let currentChannel = '';

            action_value.forEach(function (av) {
                targetChannels[av.type].channel = av.name;
                targetChannels[av.type].currentTarget = av.name;
                targetChannels[av.type].isEnabled = true;
                targetChannels[av.type].icon = av.name === 'sms' ? 'smsIcon_white@2x.png' : (av.name === 'push' ? "ap_white@2x.png" : "em_white@2x.png");
                msgBldr[av.name] = av.value;
                if (! currentChannel)
                    currentChannel = av.name;
            });

            if (! game.hasOwnProperty('id'))
                game.id = 999999;

            if (! mission.hasOwnProperty('id'))
                mission.id = 999999;

            return {
                ...state, gameToCreate: game,
                trigger_type: action_type,
                targetChannels: targetChannels,
                missionToCreate: {...mission, isEdit: true},
                gameMissionTypeToCreate: action.gmType,
                selectedTab: action.tab,
                segment: {...state.segment, type: 'saved', segments:  mission.target_segments.split(',').map(s => ({id: s})) },
                messageBuilder: msgBldr,
                tmpMessageBuilder: msgBldr,
                currentChannel: currentChannel,
            };
        }
        case 'SET_DEFAULT_VALUE':
            return {...state, ...action.obj};
        case 'SET_PUNCH_DATA':
            return {...state, punchCardListData: action.punch};
        case 'SET_VOUCHER_DATA':
            return {...state, voucherListData: action.voucher};
        default:
            return state;
    }//...... end of switch() .....//
};