// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract TaskContract{
    event AddTask(address recepient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    struct Task{
        uint id;
        string taskText;
        bool isDeleted;
    }
    Task[] private tasks;
    // mapping the task id to the address
    mapping(uint256 => address) taskToOwner;
    function addTask(string memory taskText, bool isDeleted) external{
        uint taskId = tasks.length;
        tasks.push(Task(taskId, taskText, isDeleted));
        // attach the task by id to the owner
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }
    // getting back the tasks
    function getMyTask() public view returns(Task[] memory){
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for(uint i = 0; i < tasks.length; i ++){
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false){
                // copy matching tasks that pass the condition**** temporary[counter] = tasks[i]*** is the correct way as
                // Every time a task matches the filter, it's added to the next available slot in the temporary array
                // rather than temporary[i] = tasks[i]; as it creates empty chuck spaces
                temporary[counter] = tasks[i];
                counter ++;
            }
        }
        // This will return a sizeable array of results without trailing empty slots
        Task[] memory result = new Task[](counter);
        for(uint i = 0; i < counter; i ++){
            result[i] = temporary[i];
        }
        return result;
    }

    function deleteTask(uint taskId) external{
        if(taskToOwner[taskId] == msg.sender){
            // tasks[taskId].isDeleted = isDeleted;
            // the above code should be like this 👇👇
            tasks[taskId].isDeleted = true;

            // emit DeleteTask(taskId, isDeleted);
            // the above code shoould be like this👇👇
            emit DeleteTask(taskId, true);
        }
    }
}
