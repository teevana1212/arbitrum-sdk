import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import networks, {
  L1Network,
  L2Network,
  l1Networks,
  l2Networks,
} from './networks'

export interface SignersAndProviders {
  l1Provider?: Provider
  l2Provider?: Provider
  l1Signer?: Signer
  l2Signer?: Signer
}

export class MultiChainConnector {
  l1Provider?: Provider
  l2Provider?: Provider
  l1Signer?: Signer
  l2Signer?: Signer
  l1Network?: L1Network
  l2Network?: L2Network

  public async initSignorsAndProviders(
    signersAndProviders: SignersAndProviders
  ) {
    const { l1Provider, l2Provider, l1Signer, l2Signer } = signersAndProviders
    if (l1Signer) {
      this.l1Signer = l1Signer
      if (l1Signer.provider) {
        this.l1Provider = l1Signer.provider
      }
    }
    if (l2Signer) {
      this.l2Signer = l2Signer
      if (l2Signer.provider) {
        this.l2Provider = l2Signer.provider
      }
    }

    if (!this.l1Provider && l1Provider) {
      this.l1Provider = l1Provider
    }

    if (!this.l2Provider && l2Provider) {
      this.l2Provider = l2Provider
    }

    if (this.l1Provider) {
      const chainID = (await this.l1Provider.getNetwork()).chainId.toString()
      const l1Network = l1Networks[chainID]
      if (!l1Network) throw new Error('todo: custom')
      this.l1Network = l1Network
    }
    if (this.l2Provider) {
      const chainID = (await this.l2Provider.getNetwork()).chainId.toString()
      const l2Network = l2Networks[chainID]
      if (!l2Network) throw new Error('todo: custom')
      this.l2Network = l2Network
    }

    if (this.l1Network && this.l2Network) {
      if (this.l2Network.partnerChainID !== this.l1Network.chainID) {
        throw new Error('chains mismatched')
      }
    }
  }
}
