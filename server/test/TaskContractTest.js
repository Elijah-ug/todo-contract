// const { time, loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// Import testing helpers
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task contract", () => {
  let taskContract; // This will hold the deployed contract instance
  let owner;        // This will be the owner (first account from signers)

  const NUMBER_OF_TASKS = 5; // We’ll add 5 tasks before each test

  // This block runs before each test case
  beforeEach(async () => {
    let totalTasks = [];       // Used to store the task data locally
    // Get the contract factory (like a blueprint for deployment)
    const TaskContract = await ethers.getContractFactory("TaskContract");

    // Get the first signer from the Hardhat local accounts
    const accounts = await ethers.getSigners();
    owner = accounts[0];

    // Deploy the contract to a local in-memory test network
    taskContract = await TaskContract.deploy();
    await taskContract.waitForDeployment(); // ethers v6 syntax

    // Add 5 sample tasks to the contract
    for (let i = 0; i < NUMBER_OF_TASKS; i++) {
      const task = {
        taskText: `The number: - ${i}`,
        isDeleted: false,
      };

      // Add the task to the smart contract
      await taskContract.addTask(task.taskText, task.isDeleted);

      // Store a copy locally for reference
      totalTasks.push(task);
    }
  });

  // Test group for the "Add Task" functionality
  describe("Add Task", () => {
    it("should emit AddTask event", async () => {
      const task = {
        taskText: "New Task",
        isDeleted: false,
      };

      // We’ve already added 5 tasks in beforeEach
      // So this one will have index 5

      // Check that adding a task emits the AddTask event with correct args
      await expect(taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUMBER_OF_TASKS); // 5 is the next index
    });
  });

  // Test group for fetching tasks
  describe("Get all tasks", () => {
    it("Should return correct total number of tasks", async () => {
      // Call the contract’s getMyTask function
      const tasksFromChain = await taskContract.getMyTask();

      // Confirm it returns 5 tasks (set in beforeEach)
      expect(tasksFromChain.length).to.equal(NUMBER_OF_TASKS);
    });
  });

  // Test group for deleting a task
  describe("Delete Task", () => {
    it("Should emit the DeleteTask event", async () => {
      const TASK_ID = 0;
      const TASK_DELETED = true;
      // Check that the deleteTask function emits the DeleteTask event
      await expect(taskContract.deleteTask(TASK_ID))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
    it("Should not return the deleted task when fetching the tasks", async () => {
      await taskContract.deleteTask(0);
      const tasks = await taskContract.getMyTask()
      // on delete, so we expect 4 remaining
      expect(tasks.length).to.equal(NUMBER_OF_TASKS - 1);
      for (let task of tasks) {
        // confirming that none has isDeleted = true;
        expect(task.isDeleted).to.equal(false);
      }
    })
  });
});
