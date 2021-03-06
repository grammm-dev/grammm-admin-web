// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, FormControl, TextField,
  MenuItem, Button, DialogActions, CircularProgress, InputLabel, Select, Input, 
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { addFolderData, addOwnerData } from '../../actions/folders';
import { fetchUsersData } from '../../actions/users';

const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(4),
  },
  input: {
    marginBottom: theme.spacing(3),
  },
  select: {
    minWidth: 60,
  },
});

class AddFolder extends PureComponent {

  state = {
    displayname: '',
    container: 'IPF.Note',
    owners: [],
    comment: '',
    loading: false,
  }

  componentDidMount() {
    this.props.fetchUsers(this.props.domain.ID)
      .catch(error => this.setState({ snackbar: error }));
  }

  types = [
    { name: 'Mail and post items', ID: 'IPF.Note' },
    { name: 'Contact', ID: 'IPF.Contact' },
    { name: 'Appointment', ID: 'IPF.Appointment' },
    { name: 'Sticky note', ID: 'IPF.Stickynote' },
    { name: 'Task', ID: 'IPF.Task' },
  ]

  handleInput = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  }

  handleCheckbox = field => event => this.setState({
    [field]: event.target.checked,
  });

  handleAdd = () => {
    const { add, onSuccess, onError, domain } = this.props;
    this.setState({ loading: true });
    add(domain.ID, {
      ...this.state,
      loading: undefined,
    })
      .then(() => {
        this.setState({
          displayname: '',
          container: 'IPF.Note',
          owners: [],
          comment: '',
          loading: false,
        });
        onSuccess();
      })
      .catch(error => {
        onError(error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { classes, t, open, onSuccess, Users } = this.props;
    const { displayname, owners, container, comment, loading } = this.state;

    return (
      <Dialog
        onClose={onSuccess}
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('addHeadline', { item: 'Folder' })}</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <FormControl className={classes.form}>
            <TextField 
              label={t("Folder name")}
              value={displayname}
              onChange={this.handleInput('displayname')}
              className={classes.input}
              autoFocus
            />
            <TextField
              select
              className={classes.input}
              label={t("Container")}
              fullWidth
              value={container || ''}
              onChange={this.handleInput('container')}
            >
              {this.types.map((type, key) => (
                <MenuItem key={key} value={type.ID}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField 
              className={classes.input} 
              label={t("Comment")} 
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={this.handleInput('comment')}
            />
            <FormControl className={classes.input}>
              <InputLabel id="demo-mutiple-chip-label">{t("Owners")}</InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                fullWidth
                value={owners || []}
                onChange={this.handleInput('owners')}
                input={<Input id="select-multiple-chip" />}
              >
                {Users.map((user, key) => (
                  <MenuItem
                    key={key}
                    value={user.username} /* highly unconventional, should be changed to ID @f */
                    selected={owners.find(owner => owner.ID === user.ID)}
                  >
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onSuccess}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={this.handleAdd}
            variant="contained"
            color="primary"
            disabled={!displayname || loading}
          >
            {loading ? <CircularProgress size={24}/> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddFolder.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  domain: PropTypes.object.isRequired,
  Users: PropTypes.array.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    Users: state.users.Users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add: async (domainID, folder) => {
      await dispatch(addFolderData(domainID, folder)).catch(msg => Promise.reject(msg));
    },
    addOwner: async (domainID, folderID, username) => {
      await dispatch(addOwnerData(domainID, folderID, username)).catch(msg => Promise.reject(msg));
    },
    fetchUsers: async domainID => {
      await dispatch(fetchUsersData(domainID, { sort: 'username,asc', limit: '' })).catch(msg => Promise.reject(msg));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(withStyles(styles)(AddFolder)));
