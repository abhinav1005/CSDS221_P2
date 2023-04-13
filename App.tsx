import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { useState } from 'react';
import './style.css';
import moment = require('moment');
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export default function App() {
  // toastr configuration
  toastr.options = {
    debug: false,
    positionClass: 'toast-bottom-right',
    onclick: null,
    fadeIn: 300,
    fadeOut: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
  };

  // list of items
  const [itemsList, setItemsList] = useState([]);
  // add state
  const [addState, setAddState] = useState(true);
  const [dialogbox, setDialogbox] = React.useState(false);
  // record the index to be updated
  const [updateIndex, setUpdateIndex] = useState(-100);
  const [item, setEntry] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    complete: false,
  });
  // Title checking
  const [titleMessage, setTitleMessage] = useState('');
  const [titleFlag, setTitleFlag] = useState(false);

  function checkTitle() {
    const currentTitle = item.title;
    let error = false;
    const isDuplicate = itemsList.some((item) => item.title === currentTitle);
    if (isDuplicate) {
      setTitleMessage('Enter a unique Title!');
      setTitleFlag(true);
      error = true;
    } else if (!currentTitle) {
      setTitleMessage('Enter a title!');
      setTitleFlag(true);
      error = true;
    } else {
      setTitleMessage('');
      setTitleFlag(false);
    }
    return error;
  }

  // description checking
  const [descMessage, setDescMessage] = useState('');
  const [descFlag, setDescFlag] = useState(false);
  function checkDesc() {
    const currentDescription = item.description;
    if (!currentDescription) {
      setDescMessage('Enter a description!');
      setDescFlag(true);
      return true;
    }
    setDescMessage('');
    setDescFlag(false);
    return false;
  }

  const openDialogbox = () => {
    setDialogbox(true);
  };

  const closeDialogbox = () => {
    setDialogbox(false);
  };

  // open add dialog box which pops up when add button is clicked
  const openAdd = () => {
    reset();
    setAddState(true);
    openDialogbox();
  };

  // reset everything in the dialog box
  const reset = () => {
    setEntry({
      title: '',
      description: '',
      deadline: '',
      priority: '',
      complete: false,
    });
    setTitleMessage('');
    setDescMessage('');
    setTitleFlag(false);
    setDescFlag(false);
  };

  // if there are no errors, add it to the list
  function addToList() {
    checkTitle();
    checkDesc();
    const hasError = checkTitle() || checkDesc();
    if (!hasError) {
      setItemsList((oldList) => [...oldList, item]);
      reset();
      closeDialogbox();
      toastr.success('Successfully added item');
    }
  }

  // checks and updates the isComplete for an item
  const isCompleteUpdate = (index) => (e) => {
    const newArray = [...itemsList];
    newArray[index].complete = !newArray[index].complete;
    setItemsList(newArray);
  };

  // opens the update dialog box when update button is clicked
  const updateDialog = (index) => {
    setAddState(false);
    setUpdateIndex(index);
    openDialogbox();
    let pointer = itemsList[index];
    setEntry({
      title: pointer.title,
      description: pointer.description,
      deadline: pointer.deadline,
      priority: pointer.priority,
      complete: pointer.complete,
    });
  };

  const tryEdit = () => {
    if (checkDesc()) {
      return;
    } else {
      let index = updateIndex;
      let newArrs = [...itemsList];
      let pointerItem = newArrs[index];
      newArrs[index] = {
        title: pointerItem.title,
        description: item.description,
        deadline: item.deadline,
        priority: item.priority,
        complete: pointerItem.complete,
      };
      setItemsList(newArrs);
      closeDialogbox();
      reset();
      toastr.success('updated successfully');
    }
  };

  function deleteEntry(index) {
    const newItems = [...itemsList];
    newItems.splice(index, 1);
    setItemsList(newItems);
    toastr.success('Task deleted successfully!');
  }

  return (
    <div>
      <CardHeader
        sx={{ bgcolor: 'primary.dark', color: 'white' }}
        title={
          <div>
            <Typography variant="button" component="div">
              <Grid display="flex" justifyContent="center" alignItems="center">
                <MenuIcon />
                FRAMEWORKS
              </Grid>
            </Typography>
          </div>
        }
        action={
          <Button variant="contained" onClick={openAdd}>
            <Grid display="flex" justifyContent="center" alignItems="center">
              <AddCircleIcon />
              ADD
            </Grid>
          </Button>
        }
      ></CardHeader>

      <Dialog open={dialogbox} onClose={closeDialogbox}>
        {addState ? (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <Grid display="flex" justifyContent="left" alignItems="center">
              <AddCircleIcon />
              Add Task
            </Grid>
          </DialogTitle>
        ) : (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <Grid display="flex" justifyContent="left" alignItems="center">
              <EditIcon />
              Edit Task
            </Grid>
          </DialogTitle>
        )}
        <DialogContent>
          <br />
          {addState && (
            <TextField
              error={titleFlag}
              label="Title"
              helperText={titleMessage}
              value={item.title}
              sx={{ width: '100%' }}
              onChange={(e) => setEntry({ ...item, title: e.target.value })}
            />
          )}
          <br /> <br />
          <TextField
            error={descFlag}
            label="Description"
            sx={{ width: '100%' }}
            helperText={descMessage}
            value={item.description}
            onChange={(e) => setEntry({ ...item, description: e.target.value })}
          />
          <br /> <br />
          <TextField
            type="date"
            label="Deadline"
            sx={{ width: '100%' }}
            onChange={(e) => setEntry({ ...item, deadline: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl>
            <br />
            <FormLabel>Priority</FormLabel>
            <RadioGroup
              defaultValue="low"
              row
              onChange={(e) => setEntry({ ...item, priority: e.target.value })}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="med" control={<Radio />} label="Med" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          {addState ? (
            <Button
              onClick={() => addToList()}
              variant="contained"
              sx={{ bgcolor: 'primary.dark', width: '30%' }}
            >
              <AddCircleIcon />
              &nbsp;Add
            </Button>
          ) : (
            <Button
              onClick={tryEdit}
              variant="contained"
              sx={{ bgcolor: 'primary.dark', width: '30%' }}
            >
              <EditIcon />
              Edit
            </Button>
          )}
          <Button
            onClick={closeDialogbox}
            variant="contained"
            sx={{ bgcolor: 'red', width: '30%' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer sx={{ position: 'absolute', top: '70px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography>Title</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Description</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Deadline</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Priority</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Is Complete</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {itemsList.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <Typography>{item.title}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{item.description}</Typography>
                </TableCell>
                <TableCell align="center">
                  {moment(item.deadline).format('MM/DD/YY')}
                </TableCell>
                <TableCell align="center">
                  <Typography>{item.priority}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Checkbox onChange={isCompleteUpdate(index)} />
                </TableCell>
                <TableCell align="center">
                  <div>
                    {!item.complete && (
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => updateDialog(index)}
                          sx={{ width: '85%' }}
                        >
                          <EditIcon fontSize="small" />
                          Update
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => deleteEntry(index)}
                        sx={{ bgcolor: 'red', width: '85%' }}
                      >
                        <CancelIcon />
                        Delete
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
