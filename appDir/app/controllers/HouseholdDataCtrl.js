app.controller("HouseholdDataCtrl", function ($scope, ChoreFactory, $routeParams, $window, $location) {
    // $scope.bgimg = "http://img.wikinut.com/img/19hgv38l3mly4kn3/jpeg/0/Happy-Couple.jpeg";


$scope.series = ['Points Earned To Date', 'Points Left to Earn']
$scope.pieData = [];
let hId;
let houseID;
$scope.householdMembersNamesArr = [];
let householdMembersArr=[];
$scope.choresArr = [];
let singleChore;
let choreId;
let singleMember;
let houseMem1ID;
let houseMem2ID;
$scope.householdName;
let selectedMember;
let houseMemID;
let mem1CompleteChores = []
let mem2CompleteChores = []
let mem1inCompleteChores = []
let mem2inCompleteChores = []
let alreadyPoints;
let chorePointsNum;
let frequencyLimit;
let chorePoints;
let mem1Chores = [];
let mem2Chores= [];
let mem1totalPoints = 0;
let mem2totalPoints = 0;
let memPointsEarnedToDateArr = [];
let test = [];
$scope.pointsToChart =[];  //must be formatted as an array of arrays: internal arrays are NOT scoped
let leftToEarnMem1 = null;
let leftToEarnMem2 = null;
let purePointsArray = [];
let maxAmount;
let leftToEarnArr = [];
$scope.colors = ['#3498DB', '#d6240c'];
// $scope.pieColors = ['green', 'orange', 'green', 'orange']
$scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
                // fixedStepSize: 1,
                min: 0,
                max: 50            
            }

          }
          
        ]
      }
    };
$scope.labelsForPieChart = [];
$scope.pointsForPieChart = [];

$scope.piechart = false;
$scope.barchart = true;
$scope.barbutton = false;
$scope.piebutton= true;
//call the promise that returns userId, then pass that in to access household to burrow through data

$scope.$parent.getUser()
  .then ( (user) => {
    console.log('this is user returned by promise', user)
    hId = user;
    accesshousehold();
  })

//access the household with userID, called hId

let accesshousehold = () =>{
    ChoreFactory.getHouseholdId(hId)
    .then((resultsA) => {
        houseID = resultsA;
        console.log('houseID', houseID)
        //access the household name with hId, pass household name to scope

        ChoreFactory.getHouseholdName(hId)
        .then((results) => {
            console.log('these are the results of getHouseholdName', results)
            for (var prop in results) {
                console.log('this is the name prop on getHouseholdName call', results[prop].name)
                $scope.householdName = results[prop].name

            }
        })

       //pass in the upper-level and internal ID on the household object to get the household members
        ChoreFactory.getHouseholdMembers(houseID)
        .then((householdMembers) => {
            //now within householdMembers object, which contains other objects, so cycling through to extract each member's name and points earned
            for (var prop in householdMembers) { //householdMembers is an object full of other objects. Prop is the name of each internal object (in this case, the 'name' = FB returned numeric value)
                // console.log('hello');

                //put the householdmembers into an array of objects(rather than objects within objects)
                householdMembersArr.push(householdMembers[prop])

                $scope.householdMembersNamesArr.push(householdMembers[prop].name)

                memPointsEarnedToDateArr.push(householdMembers[prop].pointsEarned)


            }
                $scope.pointsToChart.push(memPointsEarnedToDateArr)
                console.log('mem1PointsEarnedToDate', memPointsEarnedToDateArr[0], 'mem2PointsEarnedToDate', memPointsEarnedToDateArr[1]);
                $scope.pieData.push(memPointsEarnedToDateArr[0])
                $scope.houseMem1=$scope.householdMembersNamesArr[0];
                $scope.houseMem2=$scope.householdMembersNamesArr[1];
            // console.log('this is houseMem1', $scope.houseMem1, 'this is houseMem2', $scope.houseMem2)
            // console.log('hId', hId, 'houseID', houseID)

            //now call all get chores and filter by top-level/internal key on household to get chores
            ChoreFactory.getAllChores(houseID)
            .then((choresObj) => {
                choresObj.forEach(function(chore){
                    if (chore.assignedMember === $scope.houseMem1){
                        console.log('we have a housemem1', $scope.houseMem1)
                        mem1Chores.push(chore)
                    }
                    else {
                       mem2Chores.push(chore)
                    }


                })
                    //now that we have chores, identify which are and are not complete
                        for (var i = 0; i < mem1Chores.length; i++) {
                            // console.log('mem1Chores[i]', mem1Chores[i])

                            // if(mem1Chores.length <= 0) {
                            //  (mem1inCompleteChores).push(newChore = {irritationPoints: 0, frequency: 0})

                            // }
                            if(mem1Chores[i].completed === false || mem1Chores[i].frequency > 0) {
                            mem1inCompleteChores.push(mem1Chores[i])
                            
                            }
                                

                            else {
                             (mem1inCompleteChores).push(newChore = {irritationPoints: 0, frequency: 0})
                            }
                        }

                         for (var i = 0; i < mem2Chores.length; i++) {
                            if ( mem2Chores[i].completed === false || mem2Chores[i].frequency > 0) {
                                mem2inCompleteChores.push(mem2Chores[i])
                            }
                            else { 
                                (mem2inCompleteChores).push(newChore = {irritationPoints: 0, frequency: 0})
                            }

                        }
                                console.log('mem 1 incomplete chores', mem1inCompleteChores, mem2inCompleteChores, 'mem2inCompleteChores');

                               
                        //calculate points left to earn based on incomplete Chores

                        for(var i = 0; i < mem1inCompleteChores.length; i++) {
                            leftToEarnMem1 = mem1inCompleteChores[i].frequency * mem1inCompleteChores[i].irritationPoints;
                        }
                        console.log('left to earnMem1', leftToEarnMem1)

                        for(var i = 0; i < mem2inCompleteChores.length; i++) {
                            leftToEarnMem2 = mem2inCompleteChores[i].frequency * mem2inCompleteChores[i].irritationPoints;
                        }
                        console.log('left to earnMem2', leftToEarnMem2)

                        //BEFORE PUSHING TO LEFT TO EARN, NEED TO FIGURE OUT HOW MUCH IS LEFT ON CHORES MARKED COMPLETE BUT NOT FINISHED

                        if (leftToEarnMem1 === null) {
                            leftToEarnMem1 = 0;
                        }

                        if (leftToEarnMem2 === null) {
                            leftToEarnMem1 = 0;
                        }
                        leftToEarnArr.push(leftToEarnMem1, leftToEarnMem2)
                        $scope.pointsToChart.push(leftToEarnArr)
                        $scope.pieData.push(leftToEarnMem1)
                        $scope.pieData.push(memPointsEarnedToDateArr[1]);
                        $scope.pieData.push(leftToEarnMem2);
                        purePointsArray.push (leftToEarnMem1, leftToEarnMem2, memPointsEarnedToDateArr[0], memPointsEarnedToDateArr[1])

                for (var i = 0; i < mem1Chores.length; i++){
                    mem1totalPoints = mem1totalPoints + parseInt(mem1Chores[i].irritationPoints)
                }

                for(var i = 0; i < mem2Chores.length; i++){
                   mem2totalPoints = mem2totalPoints + parseInt(mem2Chores[i].irritationPoints)
                }

                $scope.labelsForPieChart.push(`${$scope.householdMembersNamesArr[0]}'s' Points Earned to Date`, `${$scope.householdMembersNamesArr[0]}'s' Points Left to Earn`, `${$scope.householdMembersNamesArr[1]}'s Points Earned to Date`, `${$scope.householdMembersNamesArr[1]}'s Points Left to Earn`);


                $scope.choresArr= choresObj;
                console.log($scope.labelsForPieChart);
                console.log(purePointsArray, 'purePointsArray')
                maxAmount = Math.max(...purePointsArray);
                console.log(maxAmount, 'maxAmount')
                console.log($scope.options, 'scope.options')
                                console.log("inside options before set", $scope.options.scales.yAxes[0].ticks.max)

                $scope.options.scales.yAxes[0].ticks.max = maxAmount;
                console.log("inside options after set", $scope.options.scales.yAxes[0].ticks.max)

            })
        })
    })
}





})
