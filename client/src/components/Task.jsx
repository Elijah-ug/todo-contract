import { ListItemText } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
const Task = ({taskText, onClick, item}) => {
    return (
        <div className="w-xl mx-70 bg-white my-3 px-2" >
            <List className="flex justify-center items-center ">
                <ListItem>
                    <ListItemText className={item.isDeleted ? "line-through text-gray-300" : ""} primary={taskText} />
                </ListItem>
                <DeleteIcon fontSize="large" styled={{ opacity: 0.7 }} onClick={onClick} className="cursor-pointer text-red-500" />


            </List>
        </div>
    );
}

export default Task;
