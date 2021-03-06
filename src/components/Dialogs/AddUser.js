// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, FormControl, TextField,
  MenuItem, Button, DialogActions, CircularProgress, Select,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment';
import { addUserData } from '../../actions/users';
import { withRouter } from 'react-router';

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

class AddUser extends PureComponent {

  state = {
    username: '',
    properties: {
      displayname: '',
      storagequotalimit: '',
      displaytypeex: 0,
    },
    loading: false,
    password: '',
    repeatPw: '',
    sizeUnit: 1,
  }

  types = [
    { name: 'Normal', ID: 0 },
    { name: 'Room', ID: 7 },
    { name: 'Equipment', ID: 8 },
  ]

  handleInput = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  }

  handleCheckbox = field => event => this.setState({ [field]: event.target.checked });

  handleNumberInput = field => event => {
    let input = event.target.value;
    if(input && input.match("^\\d*?$")) input = parseInt(input);
    this.setState({
      [field]: input,
    });
  }

  handleAdd = () => {
    const { domain, add, onError, onSuccess } = this.props;
    const { username, password, properties } = this.state;
    this.setState({ loading: true });
    add(domain.ID, {
      username,
      password,
      properties: {
        ...properties,
        creationtime: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
        storagequotalimit: properties.storagequotalimit * Math.pow(2, 10 * this.state.sizeUnit),
      },
    })
      .then(() => {
        this.setState({
          username: '',
          properties: {
            displayname: '',
            storagequotalimit: '',
            displaytypeex: 0,
          },
          sizeUnit: 1,
          loading: false,
          password: '',
          repeatPw: '',
        });
        onSuccess();
      })
      .catch(error => {
        onError(error);
        this.setState({ loading: false });
      });
  }

  handleAddAndEdit = () => {
    const { domain, history, add, onError } = this.props;
    const { username, password, subType, properties } = this.state;
    this.setState({ loading: true });
    add(domain.ID, {
      username,
      password,
      subType,
      properties: {
        ...properties,
        creationtime: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
        storagequotalimit: properties.storagequotalimit * Math.pow(2, 10 * this.state.sizeUnit),
      },
    })
      .then(user => {
        history.push('/' + domain.ID + '/users/' + user.ID);
      })
      .catch(error => {
        onError(error);
        this.setState({ loading: false });
      });
  }

  handlePropertyChange = field => event => {
    this.setState({
      properties: {
        ...this.state.properties,
        [field]: event.target.value,
      },
    });
  }

  handleIntPropertyChange = field => event => {
    this.setState({
      properties: {
        ...this.state.properties,
        [field]: parseInt(event.target.value) || '',
      },
    });
  }

  handleUnitChange = event => this.setState({ sizeUnit: event.target.value });

  render() {
    const { classes, t, domain, open, onClose } = this.props;
    const { username, loading, properties, password, repeatPw, sizeUnit } = this.state;
    const { storagequotalimit, displayname, displaytypeex } = properties;
    const usernameError = username && !username.match(/^([.0-9a-z_+-]+)$/);
    return (
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('addHeadline', { item: 'User' })}</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <FormControl className={classes.form}>
            <TextField 
              label={t("Username")}
              value={username || ''}
              autoFocus
              onChange={this.handleInput('username')}
              style={{ flex: 1, marginRight: 8 }}
              InputProps={{
                endAdornment: <div>@{domain.domainname}</div>,
              }}
              className={classes.input}
              required
              error={usernameError}
            />
            <TextField 
              label={t("Password")}
              value={password || ''}
              onChange={this.handleInput('password')}
              style={{ flex: 1, marginRight: 8 }}
              className={classes.input}
              type="password"
              required
              helperText={(password && password.length < 6) ? t('Password must be at least 6 characters long') : ''}
            />
            <TextField 
              label={t("Repeat password")}
              value={repeatPw || ''}
              onChange={this.handleInput('repeatPw')}
              style={{ flex: 1, marginRight: 8 }}
              className={classes.input}
              type="password"
              required
              helperText={(repeatPw && password !== repeatPw) ? t("Passwords don't match") : ''}
            />
            <TextField 
              label={t("Display name")}
              value={displayname || ''}
              onChange={this.handlePropertyChange('displayname')}
              style={{ flex: 1, marginRight: 8 }}
              className={classes.input}
            />
            <TextField 
              className={classes.input} 
              label={t("Storage quota limit")}
              value={storagequotalimit || ''}
              onChange={this.handleIntPropertyChange('storagequotalimit')}
              InputProps={{
                endAdornment:
                  <FormControl>
                    <Select
                      onChange={this.handleUnitChange}
                      value={sizeUnit}
                      className={classes.select}
                    >
                      <MenuItem value={1}>MiB</MenuItem>
                      <MenuItem value={2}>GiB</MenuItem>
                      <MenuItem value={3}>TiB</MenuItem>
                    </Select>
                  </FormControl>,
              }}
            />
            <TextField
              select
              className={classes.input}
              label={t("Type")}
              fullWidth
              value={displaytypeex || 0}
              onChange={this.handlePropertyChange('displaytypeex')}
            >
              {this.types.map((type, key) => (
                <MenuItem key={key} value={type.ID}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="contained"
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={this.handleAddAndEdit}
            variant="contained"
            color="primary"
            disabled={usernameError || !username || loading || password !== repeatPw
              || !storagequotalimit || password.length < 6}
          >
            {loading ? <CircularProgress size={24}/> : t('Add and edit')}
          </Button>
          <Button
            onClick={this.handleAdd}
            variant="contained"
            color="primary"
            disabled={!username || loading || password !== repeatPw || !storagequotalimit || password.length < 6}
          >
            {loading ? <CircularProgress size={24}/> : t('Add')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddUser.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  domain: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    add: async (domainID, user) => 
      await dispatch(addUserData(domainID, user))
        .then(user => Promise.resolve(user))
        .catch(msg => Promise.reject(msg)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(
  withTranslation()(withStyles(styles)(AddUser))));
