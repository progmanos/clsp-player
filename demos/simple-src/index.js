import './styles.scss';

import '@babel/polyfill';

// @todo - import fontawesome
import $ from 'jquery';

import utils from '../../src/js/utils/utils';
import IovCollection from '~root/src/js/iov/IovCollection';

let iovCollection;
let iov;

function displayVersions () {
  document.title = `v${utils.version} ${document.title}`;

  const pageTitle = $('#page-title').html();
  $('#page-title').html(`${pageTitle} <br /> v${utils.version}`);
}

function registerHandlers () {
  function play () {
    if (!iov) {
      return;
    }

    window.clspPlayerControls.changeSrc();
  }

  function stop () {
    if (!iov) {
      return;
    }

    iov.stop();
  }

  function fullscreen () {
    if (!iov) {
      return;
    }

    iov.toggleFullscreen();
  }

  function destroy () {
    if (!iov) {
      return;
    }

    iovCollection.remove(iov.id);
    iov = null;
  }

  function changeSrc () {
    const streamUrl = document.getElementById('stream-src').value;

    iov.changeSrc(streamUrl);
  }

  window.clspPlayerControls = {
    play: play,
    stop: stop,
    fullscreen: fullscreen,
    destroy: destroy,
    changeSrc: changeSrc,
  };
}

async function main () {
  try {
    const videoElementId = 'my-video';
    const url = $(`#${videoElementId}`).find('source')[0].getAttribute('src');

    document.getElementById('stream-src').value = url;

    iovCollection = IovCollection.asSingleton();
    iov = await iovCollection.create(videoElementId);

    iov.changeSrc(url);
  }
  catch (error) {
    document.getElementById('browser-not-supported').style.display = 'block';
    document.getElementById(videoElementId).style.display = 'none';
    console.error(error);
  }
}

$(() => {
  displayVersions();
  registerHandlers();
  main();
});
