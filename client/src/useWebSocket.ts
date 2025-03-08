import { ref, onMounted, onUnmounted } from 'vue'

interface Message {
    type: string;
    payload: any;
}

export function useWebSocket() {
    const ws = ref<WebSocket | null>(null)
    const messages = ref<Message[]>([])
    const status = ref<'connected' | 'disconnected'>('disconnected')

    const connect = () => {
        ws.value = new WebSocket('ws://localhost:3000')

        ws.value.onopen = () => {
            status.value = 'connected'
            console.log('Connected to WebSocket')
        }

        ws.value.onmessage = (event: MessageEvent) => {
            const message: Message = JSON.parse(event.data)
            messages.value.push(message)
        }

        ws.value.onclose = () => {
            status.value = 'disconnected'
            console.log('Disconnected from WebSocket')
        }
    }

    const sendMessage = (message: Message) => {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            ws.value.send(JSON.stringify(message))
        }
    }

    onMounted(() => {
        connect()
    })

    onUnmounted(() => {
        if (ws.value) {
            ws.value.close()
        }
    })

    return {
        messages,
        sendMessage,
        status
    }
}