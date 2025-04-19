  import { useState, useEffect } from 'react'
  import { TextField, Button } from "@mui/material";
  import { contractAddress } from "../config";
  import { ethers } from "ethers";
  import TaskAbi from "../utils/TaskContract.json"
  import Task from './Task';
  function Main() {
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum || ethereum.isMetaMask !== true) {
          console.log("Metamask not installed");
          alert("Metamask not installed!");
          return;
        }
          // get the chain Id
          let chainId = await ethereum.request({ method: "eth_chainId" });
          // sepolia hex string
          let sepoliaId = "0xaa36a7";
        if (chainId !== sepoliaId) {
            alert("Please connect to Sepolia network!")
            return;
          } else {
            setCorrectNetwork(true);
          }
          // get the users wallet address
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          setCurrentAccount(accounts[0]);

        } catch (error) {
          console.log("An error occured: ", error)
        }
        // console.log("Clicked!")

    }
  // add task
    const addTask = async () => {
      const task = {
        "taskText": input,
        "isDeleted": false
      }
      try {
        const { ethereum } = window;
        if (ethereum) {
          // check if metamask is installed
          const provider = new ethers.BrowserProvider(window.ethereum)

        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(contractAddress, TaskAbi.abi, signer)
          const tx = TaskContract.addTask(input, false)
          await tx.wait();
          setInput("");
          getAllTasks();
          console.log("Task", input)
        }

      } catch (error) {

      }
    }
    // delete task
    const deleteTask  = async (id) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(contractAddress, TaskAbi.abi, signer)

          let deleteTx = await TaskContract.deleteTask(id);
          await deleteTx.wait();
          let allTask = await TaskContract.getMyTask()
          let formattedData = allTask.filter((task) => !task.isDeleted).map((task, index) => ({
            id: index, taskText: task.taskText, isDeleted: task.isDeleted
          }))
          setTasks(formattedData)
          setDeleted(true)
          // const deleted = deleteTask.map((tx) =>  console.log("formattedData: ", tx))
          // console.log("formattedData: ", deleteTask);
          return;
        }

      } catch (error) {
        console.log("Error *****", error)
      }
    }
    const getAllTasks = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract(contractAddress, TaskAbi.abi, signer)
          let allTask = await TaskContract.getMyTask()
          const formattedTasks = allTask.filter((task) => !task.isDeleted).map((task, index) => ({
            id: index,
            taskText: task.taskText,
            isDeleted: task.isDeleted
          }))
          // jbhhbbhbbbbbbb
        setTasks(formattedTasks)
          console.log("All tasks gotten");
        }

      } catch (error) {
        console.log("Error in getting all tasks *****", error)
      }
    }

    useEffect(() => {
      connectWallet();
      getAllTasks()
    }, [])
    return (
      <div className="bg-gray-200 py-4">
        {currentAccount === "" ?
          (<div>
            <Button variant="contained" size="large" onClick={connectWallet}>Connect wallet</Button>
          </div>) : correctNetwork ?
            (<div>
              <h2 className="mb-4 text-xl font-bold text-gray-500">Task Manager dApp</h2>
              <h2 className="mb-4 text-xl font-semibold text-gray-500">Current Account: { currentAccount}</h2>
              <form>
                <TextField onChange={(e) => setInput(e.target.value)} size="small" id="outlined-basic" label="Outlined" variant="outlined" />
                <Button variant="contained"  onClick={addTask}>AddTask</Button>
              </form>
              <ul className="mt-8">
                {tasks.length > 0 ? (tasks.map((item) =>( !item.isDeleted && item.taskText && (
                  <Task key={item.id} taskText={item.taskText} item={item} onClick={() => deleteTask(item.id) } />))
                )): console.log("No task yet!!") }
              </ul>
            </div>) :
            (<div>
              <p>Please connect to Sepolia Testnet and reload the page!</p>
            </div> )
        }
      </div>
    )
  }

  export default Main
