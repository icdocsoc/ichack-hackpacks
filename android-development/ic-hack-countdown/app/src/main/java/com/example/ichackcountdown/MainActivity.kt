package com.example.ichackcountdown

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ichackcountdown.ui.theme.ICHackCountdownTheme
import kotlinx.coroutines.delay

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ICHackCountdownTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CountdownTimer()
                }
            }
        }
    }
}

@Composable
fun CountdownTimer(modifier: Modifier = Modifier) {
    // IC Hack 2025 submission time
    val targetTime = 1769947200000L // February 1st, 12:00PM UTC

    var timeRemaining by remember {
        mutableLongStateOf((targetTime - System.currentTimeMillis()).coerceAtLeast(0))
    }

    var isDetailedFormat by remember {
        mutableStateOf(true)
    }

    LaunchedEffect(Unit) {
        while (timeRemaining > 0) {
            delay(1000L) // Wait 1 second
            timeRemaining = (targetTime - System.currentTimeMillis()).coerceAtLeast(0)
        }
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Text(
            text = "IC Hack 2025\nTime until submission",
            textAlign = TextAlign.Center,
            fontSize = 24.sp,
            lineHeight = 36.sp,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (timeRemaining > 0) {
                formatTime(timeRemaining, isDetailedFormat)
            } else {
                "🎉 IC Hack has begun!"
            },
            fontSize = if (timeRemaining <= 0 && isDetailedFormat) 32.sp else 48.sp,
            lineHeight = if (timeRemaining <= 0 && isDetailedFormat) 44.sp else 56.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(onClick = { isDetailedFormat = !isDetailedFormat }) {
            Text(if (isDetailedFormat) "Show compact" else "Show detailed")
        }
    }
}

fun formatTime(millis: Long, detailed: Boolean = true): String {
    val totalSeconds = millis / 1000
    val days = totalSeconds / 86400
    val hours = (totalSeconds % 86400) / 3600
    val minutes = (totalSeconds % 3600) / 60
    val seconds = totalSeconds % 60

    return if (detailed) {
        buildString {
            if (days > 0) append("$days days, ")
            if (hours > 0 || days > 0) append("$hours hours, ")
            append("$minutes minutes, $seconds seconds")
        }
    } else {
        String.format("%02d:%02d:%02d", hours + days * 24, minutes, seconds)
    }
}

@Preview(showBackground = true)
@Composable
fun TimerPreview() {
    ICHackCountdownTheme {
        CountdownTimer()
    }
}