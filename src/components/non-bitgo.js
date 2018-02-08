import React, { Component } from 'react';
import Select from 'react-select';
import { InputField, InputTextarea } from './form-components';
import { Form, Button, Row, Col, FormGroup, Label } from 'reactstrap';
import ErrorMessage from './error-message';

import recoverEth from 'tools/eth-backup-key-recovery';

import tooltips from 'constants/tooltips';
const formTooltips = tooltips.ethRecovery;

class NonBitGoRecoveryForm extends Component {
  state = {
    boxAValue: '',
    boxBValue: '',
    walletContractAddress: '',
    walletPassphrase: '',
    recoveryAddress: '',
    env: 'test'
  }

  updateRecoveryInfo = (fieldName) => (event) => {
    this.setState({ [fieldName]: event.target.value });
  }

  updateEnv = (option) => {
    this.setState({ env: option.value });
  }

  async performRecovery() {
    this.setState({ recovering: true, error: '' })
    try {
      console.log('Recovering with these parameters', this.state);
      window.recoveryParams = this.state;
      const sendResult = await recoverEth(this.state);
      console.log(sendResult);
      this.setState({ recovering: false, done: true });
    } catch (e) {
      this.setState({ error: e.message, recovering: false });
    }
  }

  render() {
    const envOptions = [ { label: 'Mainnet', value: 'prod' }, { label: 'Testnet (Kovan)', value: 'test' } ];

    return (
      <div>
        <h1>ETH Non-BitGo Recovery</h1>
        <p className='subtitle'>This tool will help you use your recovery KeyCard to build and send a transaction that does not rely on BitGo APIs.</p>
        <hr />
        <Form>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label className='input-label'>
                  Environment
                </Label>
                <Select
                  type='select'
                  options={envOptions}
                  onChange={this.updateEnv}
                  name={'env'}
                  value={this.state.env}
                  clearable={false}
                  searchable={false}
                />
              </FormGroup>
            </Col>
          </Row>
          <InputTextarea
            label='Box A Value'
            name='boxAValue'
            onChange={this.updateRecoveryInfo('boxAValue')}
            value={this.state.boxAValue}
            tooltipText={formTooltips.boxAValue}
          />
          <InputTextarea
            label='Box B Value'
            name='boxBValue'
            onChange={this.updateRecoveryInfo('boxBValue')}
            value={this.state.boxBValue}
            tooltipText={formTooltips.boxBValue}
          />
          <InputField
            label='Wallet Contract Address'
            name='walletContractAddress'
            onChange={this.updateRecoveryInfo('walletContractAddress')}
            value={this.state.walletContractAddress}
            tooltipText={formTooltips.walletContractAddress}
          />
          <InputField
            label='Wallet Passphrase'
            name='walletPassphrase'
            onChange={this.updateRecoveryInfo('walletPassphrase')}
            value={this.state.walletPassphrase}
            isPassword={true}
            tooltipText={formTooltips.walletPassphrase}
          />
          <InputField
            label='Destination Address'
            name='recoveryAddress'
            onChange={this.updateRecoveryInfo('recoveryAddress')}
            value={this.state.recoveryAddress}
            tooltipText={formTooltips.recoveryAddress}
          />
          {this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage>}
          <Button onClick={this.performRecovery.bind(this)} disabled={this.state.recovering} className='bitgo-button'>
            {this.state.recovering ? 'Recovering...' : 'Recover Funds'}
          </Button>
        </Form>
      </div>
    )
  }
}

export default NonBitGoRecoveryForm;