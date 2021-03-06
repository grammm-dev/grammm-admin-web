import React from 'react';
import { Portal, Snackbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Alert from '@material-ui/lab/Alert';

class Feedback extends PureComponent {
  
  render() {
    const { snackbar, onClose } = this.props;
    return (
      <Portal>
        <Snackbar
          open={!!snackbar}
          onClose={onClose}
          autoHideDuration={snackbar === 'Success!' ? 1000 : 6000}
          transitionDuration={{ in: 0, appear: 250, enter: 250, exit: 0 }}
        >
          <Alert
            onClose={onClose}
            severity={snackbar === 'Success!' ? "success" : "error"}
            elevation={6}
            variant="filled"
          >
            {snackbar || ''}
          </Alert>
        </Snackbar>
      </Portal>
    );
  }
}

Feedback.propTypes = {
  snackbar: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default Feedback;
