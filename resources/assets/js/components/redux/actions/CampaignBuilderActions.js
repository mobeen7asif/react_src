export const setSelectedTabs = (tabs) => {
    return {type: 'SET_SELECTED_TAB_VALUE', tabs};
};

export const setCampaignType = (campaignObject) => {
    return {type: 'SET_CAMPAIGN_TYPE', campaign: campaignObject}
};

export const addCampaignValue = (campaignObject) => {
    return {type: 'ADD_CAMPAIGN_VALUE', campaign: campaignObject}
};

export const addSuggestedTags = (suggestedTags) => {
    return {type: 'ADD_SUGGESTED_TAGS', suggestedTags}
};

export const setSegmentType = (obj) => {
    return {type: 'SET_SEGMENT_TYPE', segment: obj}
};

export const addSavedSegment = (obj) => {
    return {type: 'SET_SAVED_SEGMENT', segments: obj};
};

export const setSegmentUsers = (obj) => {
    return {type: 'SET_SEGMENT_USERS', segment: obj};
};

export const addSegmentValue = (segmentKeyValue) => {
    return {type: 'ADD_SEGMENT_VALUE', segment: segmentKeyValue}
};

export const addNewSegmentValue = (new_segment) => {
    return {type: 'ADD_NEW_SEGMENT_VALUE', new_segment};
};

export const addNewSearchMemberValue = (new_search) => {
    return {type: 'ADD_NEW_SEARCH_MEMBER_VALUE', new_search};
};

export const clearSegment = () => {
    return {type: 'CLEAR_SEGMENT', segment: {new_segment: {}, segment_users: {}}};
};

export const setTriggerType = (triggerType) => {// trigger types like Alert, Email, Game
    return {type: 'SET_TRIGGER_TYPE', triggerType};
};

export const setTargetChannelValue = (obj) => {
    return {type: 'SET_TARGET_CHANNELS_VALUE', targetChannel: obj};
};

export const setBeaconsData = (beaconsData) => {
    return {type: 'SET_BEACONS_DATA', beaconsData};
};

export const addBeaconsList = (beacons) => {//.... store beacons list, then used for dropdown listing.
    return {type: 'ADD_BEACONS_LIST', beacons};
};

export const addFloorsList = (floors) => {//..... store floors list for dropdown population.
    return {type: 'ADD_FLOORS_LIST', floors}
};

export const addMessageBuilderValue = (messageBuilder) => {
    return {type: 'ADD_MESSAGE_BUILDER_VALUE', messageBuilder};
};

export const addCampaignSchedulerType = (schedulerType) => {
    return {type: 'ADD_CAMPAIGN_SCHEDULER_TYPE', schedulerType: {campaignSchedulerType: schedulerType}}
};

export const addScheduleValue = (scheduleObject) => {
    return {type: 'ADD_SCHEDULE_VALUE', schedule:{schedule: scheduleObject}};
};

export const resetCampaignBuilder = () => {
    return {type: 'RESET_CAMPAIGN_BUILDER'};
};

export const addEditCampaignData = (campaign) => {
    return {type: 'ADD_EDIT_CAMPAIGN_DATA', campaign};
};

export const addSavedSegmentListForCampaignBuilder = (segments) => {
    return {type: 'ADD_SAVED_SEGMENT_LIST', segments};
};

export const setCurrentChannel = (channel) => {
    return {type: 'SET_CURRENT_CHANNEL', channel};
};

export const setBusinessList = (businesses) => {
    return {type: 'SET_BUSINESS_LIST', businesses};
};

export const setPointTypeList = (pointTypesList) => {
    return {type: 'SET_POINT_TYPE_LIST', pointTypesList};
};

export const setRewardSmsBuilderType = (channel, type) => {
    return {type: 'SET_REWARD_SMS_BUILDER_TYPE', channel, selectedType: type};
};

export const setEmailBuilderType = (type) => {
    return {type: 'SET_EMAIL_BUILDER_TYPE', selectedType: type};
};

export const setSelectedEmailTemplate = (template) => {
    return {type: 'SET_SELECTED_EMAIL', template};
};

export const setAlertMessageBuilderType = (channel,type) => {
    return {type: 'SET_ALERT_MESSAGE_BUILDER_TYPE', channel, selectedType: type};
};

export const setAlertTreeData = (data) => {
    return {type: 'SET_TREE_DATA', data};
};

export const setTreeStructure = (data) => {
    return {type: 'SET_MAIN_TREE', data};
};

export const setSelectArray = (data) => {
    return {type: 'SET_MAIN_TREE_SELECTED', data};
};


export const resetTreeStructure = () => {
    return {type: 'RESET_TREE_STRUCTURE'};
};

export const addGameValue = (obj) => {
    return {type: 'ADD_GAME_VALUE', game: obj}
};

export const setGameMissionCreatingType = (value = '', tab = 2) => {
    return {type: 'SET_GAME_MISSION_CREATING_TYPE', value, tab}
};

export const setGameData = (value = {}) => {
    return {type: 'SET_GAME_DATA', value}
};

export const setGameForAddingMoreOutCome = (game = {}) => {
    return {type: 'SET_GAME_FOR_ADDING_MORE_OUTCOME', data: {gameToCreate: game, gameMissionTypeToCreate: 'game-outcome', selectedTab: 5}}
};

export const setGameForEditingOutCome = (game = {}, key) => {
    return {type: 'SET_GAME_FOR_EDITING_OUTCOME', data: {selected_outcome:key, gameToCreate: game, gameMissionTypeToCreate: 'game-outcome', selectedTab: 5}}
};

export const setGameForAddingMission = (game = {}) => {
    return {type: 'SET_GAME_FOR_ADDING_MORE_MISSION', data: {gameToCreate: game, gameMissionTypeToCreate: 'game-mission'}}
};

export const addMissionValue = (obj) => {
    return {type: 'ADD_MISSION_VALUE', mission: obj}
};

export const addMissionScheduleValue = (scheduleObject) => {
    return {type: 'ADD_MISSION_SCHEDULE_VALUE', scheduleObject};
};

export const setGameMissionData = (value) => {
    return {type: 'SET_GAME_MISSION_DATA', value}
};

export const setDeleteMission = (game) => {
    return {type: 'SET_DELETE_MISSION', game}
};

export const setMissionForAddingOutcome = (game, mission) => {
    return {type: 'SET_MISSION_FOR_ADDING_OUTCOME', value:{game, mission}};
};

export const setMissionForEditingOutcome = (game, mission,selected_outcome,selected_mission,selected_game) => {
    return {type: 'SET_MISSION_FOR_EDITING_OUTCOME', value:{game, mission, selected_outcome,selected_mission,selected_game}};
};


export const setMissionOutcome = (obj) => {
    return {type: 'SET_MISSION_OUTCOME', obj};
};

export const setMissionForDuplication = (game, mission) => {
    return {type: 'SET_MISSION_FOR_DUPLICATION', value:{game, mission}};
};

export const setDuplicatedMission = () => {
    return {type: 'SET_DUPLICATED_MISSION'};
};


export const resetSegmentSearch = () => {
    return {type: 'RESET_MEMBER_SEARCH'};
};

export const setCompetitionsList = ({competitionList} = {}) => {
    return {type: 'SET_COMPETITION_LIST', competitionList};
};

export const setPetPacksList = ({petPackList} = {}) => {
    return {type: 'SET_PET_PACK_LIST', petPackList};
};

export const setIsCompetition = (IsCompetition) => {
    return {type: 'SET_IS_COMPETITION', IsCompetition};
};

export const addGameForEditing = (game, gmType, tab = 2) => {
    return {type: 'SET_GAME_TO_EDIT', game, gmType, tab};
};

export const addMissionForEditing = (game, mission, gmType, tab = 2) => {
    return {type: 'SET_MISSION_TO_EDIT', value:{game, mission}, gmType, tab};
};
export const setCamapaignDefaultValue = (key, value) => {
    return {type:'SET_DEFAULT_VALUE', obj: {[key]: value}}
};
export const setPunchData = (punch) => {
    return {type: 'SET_PUNCH_DATA', punch};
};

export const setVoucherData = (voucher) => {
    return {type: 'SET_VOUCHER_DATA', voucher};
};