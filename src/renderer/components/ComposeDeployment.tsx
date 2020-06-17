/**
 * ************************************
 *
 * @module  ComposeDeployment.tsx
 * @author Yevgeniy Skroznikov
 * @date 3/11/20
 * @description container for the title, the service info and the file open
 *
 * ************************************
 */

import React, { useState, useEffect } from 'react';
import { FaUpload, FaDownload, FaRegPlayCircle, FaRegStopCircle } from 'react-icons/fa';
import { remote } from 'electron';
import { GiFirstAidKit } from 'react-icons/gi';
import { 
  runDockerComposeDeployment,
  runDockerComposeKill,
  runDockerComposeListContainer
} from '../../common/runShellTasks';

import {
  FileOpen
} from '../App.d';

enum DeploymentStatus {
    OpeningFile = 0,
    NoFile,
    Dead,
    DeadError,
    Checking,
    Deploying,
    Undeploying,
    Warning,
    Running,
};

type Props = {
    currentFilePath: string;
    fileOpen: FileOpen
};

const Deployment: React.FC<Props> = ({ currentFilePath, fileOpen }) => {
  const [ deployState, setDeployState ] = useState(DeploymentStatus.NoFile);
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ healthCheckRunning, setHealthCheckRunning ] = useState(false);

  console.log('compose', currentFilePath);
  useEffect(() => {
    if(currentFilePath !== '') deployCheck();
    else if(deployState !== DeploymentStatus.NoFile) setDeployState(DeploymentStatus.NoFile);
  }, [currentFilePath]);

  const deployCheck = () => {
    if(deployState === DeploymentStatus.OpeningFile && currentFilePath !== ''){
      deployCompose();
    }
    else {
      setDeployState(DeploymentStatus.Checking)
      runDockerComposeListContainer(currentFilePath)
      .then((results: any) => {
        if(results.error) {
          setErrorMessage(results.error.message);
          setDeployState(DeploymentStatus.DeadError);
        } 
        else if(results.out.split('\n').length > 3){
          if(results.out.includes('Exit')) setDeployState(DeploymentStatus.Dead);
          else setDeployState(DeploymentStatus.Running);
        }
        else setDeployState(DeploymentStatus.Dead);
      });
    }
  };

  //function definitions
  const toggleStart = (e: React.MouseEvent) => {
    healthCheckRunning ? setHealthCheckRunning(false): setHealthCheckRunning(true);
    console.log('toggleStart invoked...healthCheckRunning=', healthCheckRunning);
    e.stopPropagation();
  }

  const deployCompose = () => {
    setDeployState(DeploymentStatus.Deploying)
    runDockerComposeDeployment(currentFilePath)
      .then((results: any) => { 
        if(results.error) {;
          setErrorMessage(results.error.message);
          setDeployState(DeploymentStatus.DeadError);
        }
      else setDeployState(DeploymentStatus.Running);
    })
    .catch(err => console.log('err', err));
  }

  const deployKill = () => {
    runDockerComposeKill(currentFilePath).then(() => setDeployState(DeploymentStatus.Dead));
    setDeployState(DeploymentStatus.Undeploying);
  }

  const onErrorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dialog = remote.dialog;
    dialog.showErrorBox('Error Message:', errorMessage);
  }

  let title, onClick, icon = <FaUpload className="deployment-button" size={22} />;
  const healthIcon = <GiFirstAidKit className={`${healthCheckRunning ? 'health-icon green' : 'health-icon '}`} size={24} />;
  const startButton = <FaRegPlayCircle className={`start-button ${healthCheckRunning ? 'hidden' : ''}`} size={26} onClick={toggleStart} />
  const stopButton = <FaRegStopCircle className={`stop-button ${healthCheckRunning ? '' : 'hidden'}`}  size={26} onClick={toggleStart} />

  if(deployState === DeploymentStatus.NoFile){
    title = 'Deploy Container';
    onClick = () => {};
  }
  else if(deployState === DeploymentStatus.OpeningFile){
    title = 'Opening File..';
    onClick = () => {};
  }
  else if(deployState === DeploymentStatus.Checking){
    title = 'Checking..';
    onClick = () => {};
  }
  else if(deployState === DeploymentStatus.Dead || deployState === DeploymentStatus.DeadError){
    title = "Deploy Container"
    onClick = deployCompose;
  }
  else if(deployState === DeploymentStatus.Deploying){
    title = 'Deploying..';
    onClick = () => {};
  }
  else if(deployState === DeploymentStatus.Undeploying){
    icon = <FaDownload className="open-button" size={22} />
    title = 'Undeploying..'
    onClick = () => {}
  }
  else if (deployState === DeploymentStatus.Running || deployState === DeploymentStatus.Warning) {
    icon = <FaDownload className="open-button" size={22} />
    title = 'Kill Container';
    onClick = deployKill;
  } 

  let inputButton = <input type='file'
  name='yaml'
  accept=".yml,.yaml"
  style={{ display: 'none' }}
  onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
    // make sure there was something selected
    // console.log('FileSelector Event and event.currentTarget', event, event.currentTarget)
    if (event.currentTarget) {
      // make sure user opened a file
      if (event.currentTarget.files) {
        // fire fileOpen function on first file opened
        // console.log('Event.currentTarget.file', event.currentTarget.files[0] )
        setDeployState(DeploymentStatus.OpeningFile);
        fileOpen(event.currentTarget.files[0]);
      }
    }
  }}
/>

  return (
    <div className='deploy-container' id='compose-deploy-div'>
      <div onClick={onClick} className='deploy-btn'>
        {icon}
        <label className='deployment-title'>{title}{deployState === DeploymentStatus.NoFile ? inputButton : ''}</label>
          {startButton}{stopButton}{healthIcon}
        <div className='status-container'>
          <span className={`deployment-status status-healthy 
            ${deployState === DeploymentStatus.Running || 
              deployState === DeploymentStatus.Warning ? 'status-active' : ''}`}>
          </span>
          <span className={`deployment-status status-moderate 
            ${deployState === DeploymentStatus.Deploying || 
              deployState === DeploymentStatus.Undeploying ||
              deployState === DeploymentStatus.Warning ? 'status-active' : ''}`}>
          </span>
          <span onClick={deployState === DeploymentStatus.DeadError ? onErrorClick : () => {}}className={`deployment-status status-dead 
            ${deployState === DeploymentStatus.Dead || 
              deployState === DeploymentStatus.DeadError ? 'status-active' : ''}
            ${deployState === DeploymentStatus.DeadError ? 'clickable-status' : ''}`}>
            {deployState === DeploymentStatus.DeadError ? '!' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Deployment;